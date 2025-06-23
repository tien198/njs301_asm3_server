import AdOrderCtrl from "./order";
import AdProductCtrl from "./product";
import AdminStatistic from "./statistic";

const AdminCtrl = {
    ...AdProductCtrl, ...AdOrderCtrl, ...AdminStatistic
}

export default AdminCtrl;