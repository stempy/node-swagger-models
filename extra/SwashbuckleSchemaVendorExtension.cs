using System;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Service.Extensions
{
    /// <summary>
    /// Mark your primary key on your models with the KeyAttribute.
    /// </summary>
    public class SwashbuckleSchemaVendorExtension : ISchemaFilter
    {
        public void Apply(Schema model, SchemaFilterContext context)
        {
            foreach (var schemaRegistryDefinition in context.SchemaRegistry.Definitions)
            {
                if (schemaRegistryDefinition.Value != null)
                {
                    if (!schemaRegistryDefinition.Value.Extensions.ContainsKey("x-key"))
                    {
                        var modelType = Type.GetType("namespace." + schemaRegistryDefinition.Key + ", assemblyname",
                                            false);
                        if (modelType != null)
                        {
                            foreach (var propertyInfo in modelType.GetProperties())
                            {
                                if (propertyInfo.GetCustomAttribute<KeyAttribute>() != null)
                                {
                                    schemaRegistryDefinition.Value?.Extensions.Add("x-key", propertyInfo.Name);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
