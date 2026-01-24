-- ARGV[1] = pageSize
-- ARGV[2] = lastScore (string: "-" for first page)

local pageSize   = tonumber(ARGV[1])
local lastScore  = ARGV[2]

-- first page uses the top score “100”, subsequent pages include the lastScore
local minScore = (lastScore == "-") and "1" or lastScore
local maxScore = "100"

-- now call without WITHSCORES → returns just the members
local ids = redis.call(
  "ZRANGEBYSCORE",
  "posts:byActivity",
  minScore,
  maxScore,
  "LIMIT", 0, pageSize
)

return ids
