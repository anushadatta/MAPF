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
                conflicts.append([agent1, position1, timestamp, 'position'])
                conflicts.append([agent2, position1, timestamp, 'position'])

                return conflicts
        
        # compute edge conflicts (a-b-c-d, g-e-d-c-x: conflict at c-d/d-c)
        for timestamp in range(0, min_length-1):
            agent1_position1 = path1[timestamp]         # c
            agent1_position2 = path1[timestamp+1]       # d

            agent2_position1 = path2[timestamp]         # d
            agent2_position2 = path2[timestamp+1]       # c

            # edge conflict found
            if (agent1_position1 == agent2_position2) and (agent1_position2 == agent2_position1):
                conflicts.append([agent1, [agent1_position1, agent1_position2], timestamp, 'edge'])
                conflicts.append([agent2, [agent1_position2, agent2_position2], timestamp, 'edge'])
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
    conflicts = []

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

# get conflicts for given agent only
def filter_conflicts(conflicts, agent):

    agent_conflicts = []

    # iterate through all conflicts
    for conflict in conflicts:
        # update grid if conflict for given agent
        if conflict[0] == agent:
            agent_conflicts.append(conflict)
    
    return agent_conflicts

# compute solution for agent given new constraints
def compute_updated_solution(agent, agent_positions, conflicts, grid_maze, current_path):
    
    # compute updated path
    start = agent_positions[0]
    end = agent_positions[1]
    agent_conflicts = filter_conflicts(conflicts, agent)

    path = astar(grid_maze, start, end, agent_conflicts)
    path = path + [start]             # add start position
    path = path[::-1]                 # reverse solution 

    return path