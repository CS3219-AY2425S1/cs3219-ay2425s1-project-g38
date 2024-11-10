-- Helper function to check if there is any overlap between two arrays
local function hasOverlap(array1, array2)
    local set = {}
    for _, value in ipairs(array1) do
        set[value] = true
    end
    for _, value in ipairs(array2) do
        if set[value] then
            return true
        end
    end
    return false
end

-- ZSET is used for O(log(N)) time complexity for all operations

-- Retrieve users from the sorted set (ZSET), ordered by startTime (score)
local userIds = redis.call('ZRANGE', 'searchPool', 0, -1)

-- Iterate through all users in the search pool, sorted by startTime
for _, userId in ipairs(userIds) do
    -- Get the user's data
    local socketId = redis.call('HGET', 'user:' .. userId, 'socketId')
    local startTime = redis.call('HGET', 'user:' .. userId, 'startTime')
    local criteriaJson = redis.call('HGET', 'user:' .. userId, 'criteria')

    -- Decode the JSON string for criteria
    local criteria = cjson.decode(criteriaJson)

    -- Decode arrays for matching
    local topics = criteria.topic
    local difficulties = criteria.difficulty

    -- Check if there's any overlap in topics and difficulties between current user and new user
    if hasOverlap(topics, cjson.decode(ARGV[1])) and hasOverlap(difficulties, cjson.decode(ARGV[2])) then
        -- If a match is found, remove both users from the search pool
        redis.call('ZREM', 'searchPool', userId) -- Remove from ZSET
        redis.call('DEL', 'user:' .. userId) -- Delete user data

        -- Return matched user data (match found)
        return cjson.encode({
            matchedUsers = {
                { userId = userId, socketId = socketId, criteria = criteria },
                { userId = ARGV[3], socketId = ARGV[4], criteria = { topic = cjson.decode(ARGV[1]), difficulty = cjson.decode(ARGV[2]) } }
            }
        })
    end
end

-- If no match is found, add the current user to the search pool (ZSET)
redis.call('HSET', 'user:' .. ARGV[3], 'socketId', ARGV[4], 'criteria', cjson.encode({ topic = cjson.decode(ARGV[1]), difficulty = cjson.decode(ARGV[2]) }), 'startTime', ARGV[5])
redis.call('ZADD', 'searchPool', ARGV[5], ARGV[3]) -- Add user to ZSET with startTime as score

-- Return nil (no match found)
return nil
