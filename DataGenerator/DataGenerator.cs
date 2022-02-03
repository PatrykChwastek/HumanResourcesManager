using HumanResourcesManager.Context;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HumanResourcesManager.DataGenerator
{
    public abstract class DataGenerator<TEntity> where TEntity : class
    { 
        public MDBContext _mDBContext;
        public IQueryable<TEntity> data { get; set; }
        public GeneratorConfig GeneratorConfig { get; set; } = new GeneratorConfig();

        public DataGenerator(MDBContext mDBContext)
        {
            _mDBContext = mDBContext;
            data = _mDBContext.Set<TEntity>();
        }

        public async virtual Task Generate() { }


        public void ClearData()
        {
            _mDBContext.RemoveRange(data);
        }
        public async Task<bool> SaveDataAsync()
        {
            return (await _mDBContext.SaveChangesAsync()) >= 0;
        }
    }
}
