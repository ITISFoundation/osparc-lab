from flask import Flask, render_template
from werkzeug.exceptions import NotFound, ServiceUnavailable
import json
import requests

import plotly

app = Flask(__name__)

def create_graphs(raw_data):
    graphs = [
        dict(
            data=[
                dict(
                    x=raw_data[0][0],
                    y=raw_data[0][1],
                    type='scatter'
                ),
            ],
            layout=dict(
                title='scatter plot'
            )
        ),

        dict(
            data=[
                dict(
                    x=raw_data[1][0],
                    y=raw_data[1][1],
                    type='bar'
                ),
            ],
            layout=dict(
                title='histogram'
            )
        ),

        dict(
            data=[
                dict(
                    x=raw_data[2][0],
                    y=raw_data[2][1]),
            ],
            layout=dict(
                title='data plot'
            )
        )
    ]

    return graphs

@app.route("/plot_rest", methods=['GET'])
def plot_rest():
    try:
        jdata = requests.get("http://192.168.0.11:5011/plot_rest")
    except requests.exceptions.ConnectionError:
        raise ServiceUnavailable("The calculator service is unavailable.")

    data = jdata.json()

    graphs = create_graphs(data)


    # Add "ids" to each of the graphs to pass up to the client
    # for templating
    ids = ['graph-{}'.format(i) for i, _ in enumerate(graphs)]

    # Convert the figures to JSON
    # PlotlyJSONEncoder appropriately converts pandas, datetime, etc
    # objects to their JSON equivalents
    graphJSON = json.dumps(graphs, cls=plotly.utils.PlotlyJSONEncoder)

    return render_template('layouts/index.html',
                           ids=ids,
                           graphJSON=graphJSON)


if __name__ == "__main__":
    app.run(port=5010, debug=True, host='0.0.0.0')
