-- ARGV[1] = pageSize
-- ARGV[2] = lastScore (string: "-" for first page)

local pageSize   = tonumber(ARGV[1])
local lastScore  = ARGV[2]

-- first page uses the top score “100”, subsequent pages exclude the lastScore
local maxScore = (lastScore == "-") and "100" or "("..lastScore
local minScore = "1"

-- now call without WITHSCORES → returns just the members
local ids = redis.call(
  "ZREVRANGEBYSCORE",
  "posts:byActivity",
  maxScore,
  minScore,
  "LIMIT", 0, pageSize
)

return ids
