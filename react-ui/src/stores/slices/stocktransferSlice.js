import { api, sitesApi } from "../../environments/Api"



const initialState = {
    orders: [],
    currOrder: {}, 
    status: "idle", 
    error: null
}

export const getAllStockTransfer = createAsyncThunk(
    "stocktransfer/getAllOrders",
    async () => {
        const response = await api.getAll("/sam/stockTransferOrder/all");
        return response.data
    }
)


const stocktransferSlice = createSlice({
    name: "stocktransfer",
    initialState,
    extraReducers(builder) {
        builder.addCase(fetchSites.pending, (state, action) => {
            state.status = "loading";
          });
        builder.addCase(fetchSites.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
        });
        builder.addCase(fetchSites.rejected, (state, action) => {
        state.status = "failed";
        });
    }
})

export default stocktransferSlice.reducer;

export const selectAllOrders = (state) => state.stocktransfer.orders;
