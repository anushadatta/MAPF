from astar import *

def computeConflicts(agent1, agent2, path1, path2):
        
        conflicts = []
        min_length = min(len(path1), len(path2)) - 1

        # check conflicts at each time stamp
        for timestamp in range(0, min_length):
            
            position1 = path1[timestamp]
            position2 = path2[timestamp]
            
            # conflict found
            if position1 == position2:
                conflicts.append([agent1, position1, timestamp])
                conflicts.append([agent2, position1, timestamp])

                return conflicts
        
        return conflicts # = []

def find_leaf_nodes(root_node):
    
    leaf_nodes = []
    def _get_leaf_nodes(node):

        if node is not None:
            if node.left== None and node.right==None:
                leaf_nodes.append(node)
            else:
                _get_leaf_nodes(node.left)
                _get_leaf_nodes(node.right)
    
    _get_leaf_nodes(root_node)
    
    return leaf_nodes

# Perform CT Validation: find goal node with no conflicts 
def ct_goal_node(leaf_nodes, agent_combinations):
    
    goal_nodes = []

    for node in leaf_nodes:
        for combination in agent_combinations:
            agent1 = combination[0]
            agent2 = combination[1]

            path1 = node.all_solutions[agent1]
            path2 = node.all_solutions[agent2]

            conflicts = computeConflicts(agent1, agent2, path1, path2)

        if conflicts == []:
            goal_nodes.append(node)
    
    if goal_nodes == []:
        return None
    else:
        # order nodes by cost 
        goal_nodes.sort(key=lambda x: x.total_cost)

        # break ties with CAT (conflict avoidance table)
        least_cost = goal_nodes[0].total_cost 
        goal_nodes_least_cost = []

        for node in goal_nodes:
            if node.total_cost == least_cost:
                goal_nodes_least_cost.append(node)
        
        goal_nodes_least_cost.sort(key=lambda x: len(x.conflicts))

        return goal_nodes_least_cost[0]

def ct_update_current_node(leaf_nodes):
    
    leaf_nodes.sort(key=lambda x: x.total_cost)
    # break ties with CAT (conflict avoidance table)
    least_cost = leaf_nodes[0].total_cost 
    leaf_nodes_least_cost = []

    for node in leaf_nodes:
        if node.total_cost == least_cost:
            leaf_nodes_least_cost.append(node)
    
    leaf_nodes_least_cost.sort(key=lambda x: len(x.conflicts))

    return leaf_nodes_least_cost[0]


def filter_conflicts(conflicts, agent):

    agent_conflicts = []

    # iterate through all conflicts
    for conflict in conflicts:
        # update grid if conflict for given agent
        if conflict[0] == agent:
            agent_conflicts.append(conflict)
    
    return agent_conflicts


def update_grid(agent, conflicts, grid_maze):
    
    # iterate through all conflicts
    for conflict in conflicts:
        position = conflict[1]
        grid_maze[position[0]][position[1]] = 1
    
    grid = np.array(grid_maze)

    return grid

def compare_paths(updated_path, current_path, conflicts):
    
    # wait if no low level solution OR if low level solution more expensive
    if (updated_path == None) or (len(updated_path)-len(current_path)>1):
        # wait for 1 timestamp as per latest conflict
        latest_conflict = conflicts[-1]
        resolved_path = current_path.insert(latest_conflict[1], latest_conflict[1])
        return resolved_path
    
    elif len(updated_path) <= len(current_path):
        return updated_path

def compute_updated_solution(agent, agent_positions, conflicts, grid_maze, current_path):
    
    # compute updated path
    start = agent_positions[0]
    end = agent_positions[1]
    agent_conflicts = filter_conflicts(conflicts, agent)
    updated_grid = update_grid(agent, conflicts, grid_maze)

    path = astar(updated_grid, start, end)
    path = path + [start]             # add start position
    path = path[::-1]                 # reverse solution 

    # compare current and updated paths
    final_path = compare_paths(path, current_path, agent_conflicts)

    return final_path