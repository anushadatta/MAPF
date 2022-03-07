import heapq
import numpy as np 

# Heuristics
# a, b: (x,y) coordinated

# Taxi Cab Geometry
def manhattan_heuristic(a, b):
    # |x2 - x1| + |y2 - y1|
    dx = abs(b[0]-a[0])
    dy = abs(b[1]-a[2])
    return (dx + dy)

# Chessboard movements Distance
def chebyshev_heuristic(a,b):
    dx = abs(b[0]-a[0])
    dy = abs(b[1]-a[2])
    return max(dx, dy)

# Straight Line Distance (most useful for diagonal line movements)
def euclidian_heuristic(a,b): 
    return np.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2)

def astar(grid_maze, start, goal, constraints):

    # agent can move in 4 directions (+wait)
    moves = [(0,1),(0,-1),(1,0),(-1,0),(0,0)] 

    # visited positions
    visited_set = set()

    # path travsered {current: came_from} (location,timestamp)
    came_from = {}

    # g(n) cost from start to current node
    gscore = {start:0}

    # {position: f(n)} [f(n) = g(n) + h(n)]
    fscore = {start:euclidian_heuristic(start, goal)}

    # all neighbour positions considered for next step (f(n), position)
    min_heap = []

    heapq.heappush(min_heap, (fscore[start], start, 0)) # (fscore, location, timestamp)

    timer = 0

    # traverse while list not empty
    while min_heap:
        
        timer += 1
        
        # extract position with smallest F score
        current = heapq.heappop(min_heap)
        current_position = current[1]
        current_timestamp = current[2]

        # return path solution (backtrack)
        if current_position == goal:
            data = []
            c = (current_position, current_timestamp)

            while c in came_from:
                data.append(c[0])
                c = came_from[c]

            return data

        # add current position to visited list
        visited_set.add(current_position)

        # generate valid neighbors
        neighbors = []
        
        # generate all valid neighbors 
        for i,j in moves:
            neighbor = current_position[0] + i, current_position[1] + j
            
            # check if valid neighbour 
            valid_flag = True

            # ignore neighbour if outside grid
            if 0 <= neighbor[0] < grid_maze.shape[0]:
                if 0 <= neighbor[1] < grid_maze.shape[1]:                
                    if grid_maze[neighbor[0]][neighbor[1]] == 1:
                        valid_flag = False # obstacle 
                else:
                    # array bound y walls
                    valid_flag = False
            else:
                # array bound x walls
                valid_flag = False
            
            # check for constraints (position/edge)
            for c in constraints:
                if c[2] == timer:
                    if c[3] == 'position':
                        if c[1] == neighbor:
                            valid_flag = False
                    elif c[3] == 'edge':
                        if (c[1][0]== current_position and c[1][1] == neighbor) or (c[1][0]== neighbor and c[1][1] == current_position):
                            valid_flag = False
            
            if valid_flag:
                neighbors.append(neighbor)

        # iterate through all valid neighbours 
        for neighbor in neighbors:       
            
            # ignore if neighbour visited 
            if (neighbor in visited_set) and neighbor!=current_position:
                continue

            # compute g(n) for neighbour (+1 for move/wait)
            neighbour_g_score = gscore[current_position] + 1 
            neighbour_heuristic = euclidian_heuristic(neighbor, goal)

            neighbour_f_score = neighbour_g_score + neighbour_heuristic
            
            # update values and add to open list
            # or if neighbour not in open list (i.e. untraversed position) 
            if  (neighbor not in [i[1] for i in min_heap]):
                # a-b-c-c-e
                # {successor: current} {position_x: position_x_came_from}
                # {(b,1): (a,0), (c,2):(b,1), (c,3):(c,2), (e:4):(c,3)}
                came_from[(neighbor, current_timestamp+1)] = (current_position, current_timestamp)

                gscore[neighbor] = neighbour_g_score
                fscore[neighbor] = neighbour_f_score

                heapq.heappush(min_heap, (fscore[neighbor], neighbor, current_timestamp+1)) 
            else:
                # edit the heap
                pass

    return None

if __name__ == "__main__":
    from grid import *
    grid = np.array(grid_maze)
    route = astar(grid, (1,0), (2,3), [[2, (1, 1), 1, 'position'], [2, (2, 2), 3, 'position'], [2, (2, 1), 2, 'position']]) # [2, (1, 1), 1, 'position']
    route = route + [(1,0)]             # add start position
    route = route[::-1]                 # reverse solution 

    print(route)

    from grid import *
    grid = np.array(grid_maze)
    route = astar(grid, (1,1), (0,2), [[4, [(1, 1), (0, 1)], 1, 'edge']]) 
    route = route + [(1,1)]             # add start position
    route = route[::-1]                 # reverse solution 

    print(route)

