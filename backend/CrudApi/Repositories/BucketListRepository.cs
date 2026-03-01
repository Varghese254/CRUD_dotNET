using CrudApi.Data;
using CrudApi.DTOs;
using CrudApi.Models;
using Dapper;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CrudApi.Repositories
{
    public class BucketListRepository
    {
        private readonly DapperContext _context;

        public BucketListRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BucketItem>> GetUserBucketItems(int userId)
        {
            var query = @"
                SELECT * FROM bucket_list 
                WHERE user_id = @UserId 
                ORDER BY 
                    CASE priority 
                        WHEN 'high' THEN 1 
                        WHEN 'medium' THEN 2 
                        WHEN 'low' THEN 3 
                        ELSE 4 
                    END,
                    target_date ASC,
                    created_at DESC";

            using var connection = _context.CreateConnection();
            var items = await connection.QueryAsync<BucketItem>(query, new { UserId = userId });

            // Get product links for each item
            foreach (var item in items)
            {
                item.ProductLinks = (await GetProductLinks(item.Id)).ToList();
            }

            return items;
        }

        public async Task<BucketItem?> GetBucketItemById(int id, int userId)
        {
            var query = "SELECT * FROM bucket_list WHERE id = @Id AND user_id = @UserId";
            
            using var connection = _context.CreateConnection();
            var item = await connection.QueryFirstOrDefaultAsync<BucketItem>(query, new { Id = id, UserId = userId });
            
            if (item != null)
            {
                item.ProductLinks = (await GetProductLinks(item.Id)).ToList();
            }
            
            return item;
        }

        public async Task<int> CreateBucketItem(int userId, CreateBucketItemDto dto)
        {
            var query = @"
                INSERT INTO bucket_list (user_id, item_name, description, estimated_cost, priority, target_date, category, purchased)
                VALUES (@UserId, @ItemName, @Description, @EstimatedCost, @Priority, @TargetDate, @Category, @Purchased);
                SELECT LAST_INSERT_ID();";

            using var connection = _context.CreateConnection();
            var itemId = await connection.ExecuteScalarAsync<int>(query, new
            {
                UserId = userId,
                dto.ItemName,
                dto.Description,
                dto.EstimatedCost,
                dto.Priority,
                dto.TargetDate,
                dto.Category,
                dto.Purchased
            });

            // Add product links if any
            if (dto.ProductLinks != null && dto.ProductLinks.Any())
            {
                await AddProductLinks(itemId, dto.ProductLinks);
            }

            return itemId;
        }

        public async Task<bool> UpdateBucketItem(int id, int userId, UpdateBucketItemDto dto)
        {
            var query = @"
                UPDATE bucket_list 
                SET item_name = @ItemName,
                    description = @Description,
                    estimated_cost = @EstimatedCost,
                    priority = @Priority,
                    target_date = @TargetDate,
                    category = @Category,
                    purchased = @Purchased
                WHERE id = @Id AND user_id = @UserId";

            using var connection = _context.CreateConnection();
            var affected = await connection.ExecuteAsync(query, new
            {
                Id = id,
                UserId = userId,
                dto.ItemName,
                dto.Description,
                dto.EstimatedCost,
                dto.Priority,
                dto.TargetDate,
                dto.Category,
                dto.Purchased
            });

            if (affected > 0)
            {
                // Delete existing product links and add new ones
                await DeleteProductLinks(id);
                if (dto.ProductLinks != null && dto.ProductLinks.Any())
                {
                    await AddProductLinks(id, dto.ProductLinks);
                }
                return true;
            }

            return false;
        }

        public async Task<bool> TogglePurchased(int id, int userId, bool purchased)
        {
            var query = "UPDATE bucket_list SET purchased = @Purchased WHERE id = @Id AND user_id = @UserId";
            
            using var connection = _context.CreateConnection();
            var affected = await connection.ExecuteAsync(query, new { Id = id, UserId = userId, Purchased = purchased });
            
            return affected > 0;
        }

        public async Task<bool> DeleteBucketItem(int id, int userId)
        {
            var query = "DELETE FROM bucket_list WHERE id = @Id AND user_id = @UserId";
            
            using var connection = _context.CreateConnection();
            var affected = await connection.ExecuteAsync(query, new { Id = id, UserId = userId });
            
            return affected > 0;
        }

        // Product Links Methods
        private async Task<IEnumerable<BucketItemProductLink>> GetProductLinks(int bucketItemId)
        {
            var query = "SELECT * FROM bucket_list_product_links WHERE bucket_item_id = @BucketItemId";
            
            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<BucketItemProductLink>(query, new { BucketItemId = bucketItemId });
        }

        private async Task AddProductLinks(int bucketItemId, IEnumerable<CreateProductLinkDto> links)
        {
            var query = @"
                INSERT INTO bucket_list_product_links (bucket_item_id, platform, product_url)
                VALUES (@BucketItemId, @Platform, @ProductUrl)";

            using var connection = _context.CreateConnection();
            foreach (var link in links)
            {
                await connection.ExecuteAsync(query, new
                {
                    BucketItemId = bucketItemId,
                    link.Platform,
                    link.ProductUrl
                });
            }
        }

        private async Task DeleteProductLinks(int bucketItemId)
        {
            var query = "DELETE FROM bucket_list_product_links WHERE bucket_item_id = @BucketItemId";
            
            using var connection = _context.CreateConnection();
            await connection.ExecuteAsync(query, new { BucketItemId = bucketItemId });
        }

        // Summary/Statistics
        public async Task<BucketListSummaryDto> GetSummary(int userId)
        {
            var query = @"
                SELECT 
                    COUNT(*) as TotalItems,
                    SUM(CASE WHEN purchased = TRUE THEN 1 ELSE 0 END) as PurchasedItems,
                    SUM(CASE WHEN purchased = FALSE THEN 1 ELSE 0 END) as PendingItems,
                    COALESCE(SUM(estimated_cost), 0) as TotalEstimatedCost,
                    COALESCE(SUM(CASE WHEN purchased = TRUE THEN estimated_cost ELSE 0 END), 0) as PurchasedCost,
                    COALESCE(SUM(CASE WHEN purchased = FALSE THEN estimated_cost ELSE 0 END), 0) as PendingCost
                FROM bucket_list 
                WHERE user_id = @UserId";

            using var connection = _context.CreateConnection();
            var summary = await connection.QueryFirstOrDefaultAsync<BucketListSummaryDto>(query, new { UserId = userId });

            if (summary != null)
            {
                // Get items by category
                var categoryQuery = @"
                    SELECT COALESCE(category, 'other') as Category, COUNT(*) as Count
                    FROM bucket_list 
                    WHERE user_id = @UserId
                    GROUP BY category";
                
                var categories = await connection.QueryAsync<(string Category, int Count)>(categoryQuery, new { UserId = userId });
                summary.ItemsByCategory = categories.ToDictionary(x => x.Category ?? "other", x => x.Count);

                // Get items by priority
                var priorityQuery = @"
                    SELECT COALESCE(priority, 'medium') as Priority, COUNT(*) as Count
                    FROM bucket_list 
                    WHERE user_id = @UserId
                    GROUP BY priority";
                
                var priorities = await connection.QueryAsync<(string Priority, int Count)>(priorityQuery, new { UserId = userId });
                summary.ItemsByPriority = priorities.ToDictionary(x => x.Priority ?? "medium", x => x.Count);
            }

            return summary ?? new BucketListSummaryDto();
        }
    }
}