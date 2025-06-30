-- KEYS[1] = "posts:top"
-- ARGV = list of ID strings
redis.call("DEL", KEYS[1])
for i=1,#ARGV do
  redis.call("RPUSH", KEYS[1], ARGV[i])
end
