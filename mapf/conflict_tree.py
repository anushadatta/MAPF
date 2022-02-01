class ConflictNode:
    
    def __init__(self, conflicts = [], all_solutions = {}):
        self.conflicts = conflicts              # (agent, position, timestamp)
        self.all_solutions = all_solutions      # optimal paths for all agents {agent: path}
        self.total_cost = 0                     # total cost of optimal paths for all agents (F score): 1 for move/wait

        self.left = None
        self.right = None

    def computeTotalCost(self):
        for agent in self.all_solutions:
            solution = self.all_solutions[agent]
            cost = len(solution) - 1
            self.total_cost += cost 
        
        return self.total_cost
