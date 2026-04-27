namespace SocialMedia.Application.Recommendation;

public class Candidate
{
	public Guid PostId { get; set; }
	public Guid AuthorId { get; set; }
	public double Score { get; set; }
	public CandidateSource Source { get; set; }
}

public enum CandidateSource
{
	Subscription,
	Nlp,
	Trending,
	Exploration,
	Collaborative
}
