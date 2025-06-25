namespace SocialMedia.Domain;
public interface IKeyedEntity<TKey> : IKeyedEntity
{
	TKey Id { get; set; }
}

public interface IKeyedEntity
{
}
