class Node:
   
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None

def find_leaf_nodes(node):
    
    leafs = []
    def _get_leaf_nodes(node):
        if node is not None:
            if node.left== None and node.right==None:
                leafs.append(node)
            else:
                _get_leaf_nodes(node.left)
                _get_leaf_nodes(node.right)
    
    _get_leaf_nodes(node)

    return leafs


root = Node(1)
root.left = Node(2)
root.right = Node(3)
root.left.left = Node(4)
root.right.left = Node(5)
root.right.right = Node(8)
root.right.left.left = Node(6)
root.right.left.right = Node(7)
root.right.right.left = Node(9)
root.right.right.right = Node(10)
 
import random 
# print leaf nodes of the given tree
result = find_leaf_nodes(root)
random.shuffle(result)
#print(result)

result.sort(key=lambda x: x.data)
for i in result:
    pass
    #print(i.data)

a = [ [1, (2,2), 3] ]
b = [4, (5,5), 6]
