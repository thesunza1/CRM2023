import Table from "../../components/table/table_duy.vue";
import Pagination from "../../components/table/pagination_duy.vue";
import Dropdown from "../../components/form/dropdown.vue";
import Select from "../../components/form/select.vue";
import Input_Datetime from "../../components/form/input_datetime.vue";
import Search from "../../components/form/search.vue";
import DeleteAll from "../../components/form/delete-all.vue";
import Select_Advanced from "../../components/form/select_advanced.vue";
import form_wizard_customer from "../../components/form/form_wizard_customer.vue";
import { reactive, computed, watch, ref, onBeforeMount, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  formatDateTime,
  formatDate,
  formatDateTime_2,
} from "../../assets/js/common.js";
// import { toString, _filter } from "../../assets/js/pagination.js";

// services
import Event from "../../services/event.service";
import Habit from "../../services/habit.service";
import Account from "../../services/account.service";
import Appointment from "../../services/appointment.service";
import Center_VNPT from "../../services/center_vnpt.service";
import Company_KH from "../../services/company_kh.service";
import Customer_Types from "../../services/customer_types.service";
import Customer_Work from "../../services/customer_work.service";
import Customer from "../../services/customer.service";
import Cycle from "../../services/cycle.service";
import Department from "../../services/department.service";
import Employee from "../../services/employee.service";
import Log from "../../services/log.service";
import Permission from "../../services/permission.service";
import Position from "../../services/position.service";
import Role from "../../services/role.service";
import Task from "../../services/task.service";
import Unit from "../../services/unit.service";
import Role_Permission from "../../services/role_permission.service";
import Customer_Event from "../../services/customer_event.service";
import Customer_Habit from "../../services/customer_habit.service";
import Status_Task from "../../services/status_task.service";
import Evaluate from "../../services/evaluate.service";
import Permission_Types from "../../services/permission_types.service";
// http methods
import {
  http_getAll,
  http_create,
  http_getOne,
  http_deleteOne,
  http_update,
} from "../../assets/js/common.http";

// alert methods
import {
  alert_success,
  alert_error,
  alert_delete,
  alert_warning,
  alert_info,
  alert_delete_wide,
  alert_input_text,
  alert_mail,
} from "../../assets/js/common.alert";

export {
  // components
  Table,
  Pagination,
  Dropdown,
  Select,
  Search,
  DeleteAll,
  Select_Advanced,
  form_wizard_customer,
  Input_Datetime,
  // compositions
  reactive,
  computed,
  watch,
  ref,
  onBeforeMount,
  onMounted,
  // router
  useRouter,
  // format date or datetime
  formatDateTime,
  formatDate,
  formatDateTime_2,
  // service
  Event,
  Habit,
  Account,
  Appointment,
  Center_VNPT,
  Company_KH,
  Customer_Types,
  Customer_Work,
  Customer,
  Cycle,
  Department,
  Employee,
  Log,
  Permission,
  Position,
  Role,
  Task,
  Unit,
  Role_Permission,
  Customer_Event,
  Customer_Habit,
  Status_Task,
  Evaluate,
  Permission_Types,
  // http service
  http_getAll,
  http_create,
  http_getOne,
  http_deleteOne,
  http_update,
  // alert
  alert_success,
  alert_error,
  alert_delete,
  alert_warning,
  alert_info,
  alert_delete_wide,
  alert_input_text,
  alert_mail,
};
