import heapq
import numpy as np 

# Straight line distance (NOT Manhattan Distance), because we allow diagonal line movement
# a, b: (x,y) coordinated
def heuristic(a, b):
    return np.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2)

def astar(array, start, goal, constraints):

    # agent can move in 4 directions (+wait)
    neighbors = [(0,1),(0,-1),(1,0),(-1,0),(0,0)] 

    # visited positions
    visited_set = set()

    # path travsered {neighbour: current}
    came_from = {'wait':[]}

    # g(n) cost from start to current node
    gscore = {start:0}

    # {position: f(n)} [f(n) = g(n) + h(n)]
    fscore = {start:heuristic(start, goal)}

    # all neighbour positions considered for next step (f(n), position)
    oheap = []

    heapq.heappush(oheap, (fscore[start], start))

    # add constraints as per timestamp
    timer = 0
    constraint_flag = False

    # traverse while list not empty
    while oheap:

        timer += 1

        # extract neighbour position with smallest F score
        current = heapq.heappop(oheap)[1]

        # return path solution
        if current == goal:
            data = []
            wait_positions = came_from['wait']

            while current in came_from:
                data.append(current)

                while current in wait_positions:
                    data.append(current)
                    wait_positions.remove(current)

                current = came_from[current]

            return data

        # add current position to visited list
        visited_set.add(current)

        # update constraints as per timer 
        for c in constraints:
            if c[2] == timer:
                constraint_flag = True
                constrained_position = c[1]
                array[constrained_position[0]][constrained_position[1]] == 1

        # iterate through all 4 neighbours 
        for i, j in neighbors:

            neighbor = current[0] + i, current[1] + j            

            # compute g(n) for neighbours
            neighbour_g_score = gscore[current] + 1 

            # ignore neighbour if outside grid
            if 0 <= neighbor[0] < array.shape[0]:
                if 0 <= neighbor[1] < array.shape[1]:                
                    if array[neighbor[0]][neighbor[1]] == 1:
                        continue # obstacle 
                else:
                    # array bound y walls
                    continue
            else:
                # array bound x walls
                continue
            
            # ignore if neighbour visited and g(n) greater than previously computed
            if (neighbor in visited_set) and (neighbour_g_score >= gscore.get(neighbor, 0)) and neighbor!=current:
                continue
            
            # update values and add to open list
            # if neighbour g(n) lesser than previously computed 
            # or if neighbour not in open list (i.e. untraversed position) 
            if  (neighbour_g_score < gscore.get(neighbor, 0)) or (neighbor not in [i[1]for i in oheap]):
                
                # a-b-c-c-e
                # {successor: current} {b:a, c:b, c:c, 'wait'=[c]}
                if neighbor==current:
                    came_from['wait'].append(neighbor)
                else:
                    came_from[neighbor] = current

                gscore[neighbor] = neighbour_g_score

                fscore[neighbor] = neighbour_g_score + heuristic(neighbor, goal)

                heapq.heappush(oheap, (fscore[neighbor], neighbor)) 

        # reverse/remove constaint for next iteration
        if constraint_flag:
            array[constrained_position[0]][constrained_position[1]] == 0
            constraint_flag = False
    
    return None
