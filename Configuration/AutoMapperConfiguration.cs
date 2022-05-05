using AutoMapper;
using HumanResourcesManager.MapperConf.Profiles;


namespace HumanResourcesManager.MapperConf
{
    public class AutoMapperConfiguration
    {
        public MapperConfiguration Configure()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<EntityToDTOProfile>();
                cfg.AddProfile<DTOToEntityProfile>();
            });
 
            return config;
        }
    }
}
