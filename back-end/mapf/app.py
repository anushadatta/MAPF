import json
# import requests
from main import mapf 
from grid import grid_maze
import numpy as np
from datetime import datetime
import boto3
from botocore.exceptions import ClientError
import os
import uuid

def POST_stats_table(maze_id, user_id, maze_name, execution_cost, execution_time, agents_count, lower_level_solver, timestamp):

    try:
        dynamodb = boto3.resource('dynamodb')
        TABLE_NAME = os.environ.get("TABLE")
        table = dynamodb.Table(TABLE_NAME)

        run_id = str(uuid.uuid4())

        table.put_item(
        Item={
                'run_id': run_id,
                'user_id': user_id,
                'maze_id': maze_id,
                'maze_name': maze_name,
                'execution_cost': execution_cost,
                'execution_time': str(execution_time),
                'agents_count': agents_count,
                'lower_level_solver': lower_level_solver,
                'run_timestamp': str(timestamp)
            }
        )

        response = "Success"
        status_code = 200

    except ClientError as e:
        response = e.response['Error']['Message']
        status_code = 400

    return response, status_code


def lambda_handler(event, context):

    # MAPF Execution
    # format event for mapf
    event_body = json.loads(event['body'])
    
    agents_data = {}
    # loop through all agents
    for i in range(len(event_body['agent_positions'])):
        data = event_body['agent_positions'][i]
        agents_data[i+1] = list(map(tuple,data))

    grid_maze = event_body['maze']
    heuristic_string = event_body['heuristic']

    print(np.array(grid_maze))
    print(agents_data)

    try: 
        start = datetime.now()
        maze_solution = mapf(agents_data, grid_maze, heuristic_string)
        end = datetime.now()
        time = (end-start).total_seconds()

        agents = 0
        cost = 0
        for key in maze_solution:
            cost+=len(maze_solution[key])-1
            agents +=1

        response_body = {
            "time":time,
            "cost":cost,
            "mazeSolution":maze_solution
        }

    except:
        response = "TimeoutError: Connection timed out"
        status_code = 400

    # POST Statistics
    maze_id = event_body.get('maze_id','NA')
    maze_name = event_body.get('maze_name', 'NA')
    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]
    execution_cost= cost
    execution_time = time
    agents_count = agents
    lower_level_solver = heuristic_string
    timestamp= start

    response, status_code = POST_stats_table(maze_id, user_id, maze_name, execution_cost, execution_time, agents_count, lower_level_solver, timestamp)

    if status_code==400:
        response_body = response
    
    return {
        "statusCode": status_code,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type,Authorization,x-api-key',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        "body": json.dumps(response_body),
    }
