from fastapi import FastAPI
from pydantic import BaseModel
from chargement_model import Model, Bin, Item,Painter  # Import functions from your script
import os
import matplotlib.pyplot as plt


app = FastAPI()

# Define input model
class BoxInput(BaseModel):
    partno: str
    name: str
    typeof: str
    WHD: tuple
    weight: float
    level: int
    loadbear: int
    updown: bool
    color: str

class BinInput(BaseModel):
    partno: str
    WHD: tuple
    max_weight: float

@app.post("/pack")
def pack_boxes(bins: list[BinInput], boxes: list[BoxInput]):
    # Convert request data to objects
    list_bins = [Bin(b.partno, b.WHD, b.max_weight) for b in bins]
    list_boxes = [Item(b.partno, b.name, b.typeof, b.WHD, b.weight, b.level, b.loadbear, b.updown, b.color) for b in boxes]

    fitted_result, unfitted_result, used_time = Model(
        len(list_bins), list_bins, len(list_boxes), list_boxes, draw_result=True, print_result=False
    )

    if fitted_result:
        bin_to_visualize = list_bins[0]  # Pick the first bin for visualization
        painter = Painter(bin_to_visualize)
        fig = painter.plotBoxAndItems(title="Packing Result", alpha=0.8)
         # Ensure the output directory exists
        output_dir = "outputs"
        os.makedirs(output_dir, exist_ok=True)
        
        # Define output path
        output_path = os.path.join(output_dir, "img.png")

        # Save the figure
        fig.savefig(output_path, format="png")


    return {
        "fitted_result": fitted_result,
        "unfitted_result": unfitted_result,
        "execution_time": used_time
    }

# Run the server with: uvicorn server:app --reload
