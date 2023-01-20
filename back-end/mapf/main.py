# add error checking that start/end is not coinciding for multiple agents
# edge constraint
# --------------------------------------------------------------------------

from grid import *
from astar import *
from ct_functions import *
from conflict_tree import ConflictNode
from itertools import combinations

def mapf(agents_data, grid_maze, heuristic_string):

    agents_list = list(agents_data.keys())
    agent_combinations = list(combinations(agents_list, 2))

    # initialise MAPF instance
    grid = np.array(grid_maze)

    # compute all paths using low level A* search 
    conflicts = []
    all_solutions = {}
    for agent in agents_data:
        start = agents_data[agent][0]
        end = agents_data[agent][1]
        
        route = astar(grid, start, end, conflicts, heuristic_string)
        route = route + [start]             # add start position
        route = route[::-1]                 # reverse solution 

        all_solutions[agent] = route

    # create root node 
    root_node = ConflictNode(conflicts, all_solutions)

    # compute total cost for all agents
    root_node.computeTotalCost()

    goal_node = None
    current_node = root_node 

    while True:
        
        # Perform Validation
        leaf_nodes = find_leaf_nodes(root_node)

        # search for goal node (no conflict)
        goal_node = ct_goal_node(leaf_nodes, agent_combinations)
        
        if goal_node!= None:
            break

        # update current node
        current_node = get_optimal_node(leaf_nodes)

        # find conflicts
        for combination in agent_combinations:
            
            agent1 = combination[0]
            agent2 = combination[1]

            path1 = current_node.all_solutions[agent1]
            path2 = current_node.all_solutions[agent2]

            conflicts = computeConflicts(agent1, agent2, path1, path2)

            # resolve conflict for one agent combination
            if conflicts != []:
                
                current_conflicts = current_node.conflicts
                
                # Constraint 1
                agent_positions = agents_data[agent1]
                updated_conflicts = current_conflicts + [conflicts[0]]

                updated_solutions = current_node.all_solutions
                updated_solutions[agent1] = compute_updated_solution(
                    agent1, 
                    agent_positions, 
                    updated_conflicts, 
                    grid,
                    heuristic_string)

                current_node.right = ConflictNode(updated_conflicts, updated_solutions)
                current_node.right.computeTotalCost()

                # Constraint 2
                agent_positions = agents_data[agent2]
                updated_conflicts = current_conflicts + [conflicts[1]]
                
                updated_solutions = current_node.all_solutions
                updated_solutions[agent2] = compute_updated_solution(
                    agent2,             # current agent number
                    agent_positions,    # start/end positions
                    updated_conflicts,  
                    grid,
                    heuristic_string)              
                
                current_node.left = ConflictNode(updated_conflicts, updated_solutions)
                current_node.right.computeTotalCost()

                break


    return goal_node.all_solutions


if __name__ == "__main__":
    # Agents { agent #: [(start), (goal)]}
    agents_data = {
        1: [(0,1),(3,2)],
        2: [(1,0), (2,3)],
        3: [(0,2), (1,2)],
        4: [(1,1),(0,2)]
    }
    result = mapf(agents_data, grid_maze)

    for i in result:
        print(i, ": ", result[i])
    