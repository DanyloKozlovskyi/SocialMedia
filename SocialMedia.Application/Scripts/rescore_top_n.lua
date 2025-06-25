-- ARGV = [score1, id1, score2, id2, …]
for i = 1, #ARGV, 2 do
    redis.call("ZADD", "posts:byActivity", ARGV[i], ARGV[i+1])
end
return #ARGV / 2           -- how many members inserted
