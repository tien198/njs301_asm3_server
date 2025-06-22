import AdOrderCtrl from "./order";
import AdProductCtrl from "./product";

const AdminCtrl = {
    ...AdProductCtrl, ...AdOrderCtrl
}

export default AdminCtrl;