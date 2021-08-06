using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

namespace HumanResourcesManager.Models
{
    public class Pagination
    {
        public int Page { get; set; }
        public int Size { get; set; }
        public int TotalPages { get; set; }
        public int TotalItems { get; set; }
        public ICollection Items { get; set; }
        public Pagination(int page, int size, int totalItems)
        {
            if (page <= 0)
                page = 1;

            Page = page;
            Size = size;
            TotalItems = totalItems;
            TotalPages = (int)Math.Ceiling(TotalItems / (float)size);
        }

        public async Task<Pagination> InitPagination(IQueryable queryable)
        {
            Items = await queryable.Skip((Page - 1) * Size).Take(Size).ToDynamicArrayAsync();
            return this;
        }
    }
}
