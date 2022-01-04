import heapq
import numpy as np 

# Straight line distance (NOT Manhattan Distance), because we allow diagonal line movement
# a, b: (x,y) coordinated
def heuristic(a, b):
    return np.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2)

def astar(array, start, goal):

    # agent can move in 4 directions
    neighbors = [(0,1),(0,-1),(1,0),(-1,0)] # 8 directions = [(0,1),(0,-1),(1,0),(-1,0),(1,1),(1,-1),(-1,1),(-1,-1)]

    # list of posiitons to not reconsider 
    # append current position after every iteration
    close_set = set()

    # path taken 
    # compute shortest path from this object
    came_from = {}

    # dictionary to store G/F scores by iteration
    # G score is cost of current path from start to the current node
    gscore = {start:0}

    # F score is cost from current node (the one we are going to pick) to end node
    fscore = {start:heuristic(start, goal)}

    # all positions being considered for next step
    oheap = []

    heapq.heappush(oheap, (fscore[start], start))

    # check available positions to move while list not empty
    while oheap:

        # extract neighbour position with smallest F score
        current = heapq.heappop(oheap)[1]

        # return solution
        if current == goal:

            data = []

            while current in came_from:

                data.append(current)

                current = came_from[current]

            return data

        # add current position to closed list
        close_set.add(current)

        # iterate through all 4 neighbours 
        for i, j in neighbors:

            neighbor = current[0] + i, current[1] + j            

            # compute G score for all neighbours
            tentative_g_score = gscore[current] + heuristic(current, neighbor)

            # ignore neighbour if outside grid
            if 0 <= neighbor[0] < array.shape[0]:

                if 0 <= neighbor[1] < array.shape[1]:                

                    if array[neighbor[0]][neighbor[1]] == 1:
                        continue

                else:
                    # array bound y walls
                    continue

            else:
                # array bound x walls
                continue
            
            # ignore if neighbour in closed set and G score greater than G scores for that position
            if neighbor in close_set and tentative_g_score >= gscore.get(neighbor, 0):
                continue
            
            # if neighbour G score is less than other G scores for that position 
            # or if neighbour not in open list (i.e. a new, untested position) 
            # then update lists and add to the open list
            if  tentative_g_score < gscore.get(neighbor, 0) or neighbor not in [i[1]for i in oheap]:

                came_from[neighbor] = current

                gscore[neighbor] = tentative_g_score

                fscore[neighbor] = tentative_g_score + heuristic(neighbor, goal)

                heapq.heappush(oheap, (fscore[neighbor], neighbor)) 
    
    return None
