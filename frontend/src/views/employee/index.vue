<script>
import Mail from "../../components/box_lananh/mail.vue";
import mailService from "../../services/mail.service";
/////
import Table from "../../components/table/table_employee.vue";
import Pagination from "../../components/table/pagination_duy.vue";
import Dropdown from "../../components/form/dropdown.vue";
import Select from "../../components/form/select.vue";
import Search from "../../components/form/search.vue";
import DeleteAll from "../../components/form/delete-all.vue";
import Add from "./add.vue";
import Edit from "./edit.vue";
import View from "./view.vue";
import Select_Advanced from "../../components/form/select_advanced.vue";
import { reactive, computed, watch, ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
//service
import Employee from "../../services/employee.service";
import Position from "../../services/position.service";
import CenterServices from "../../services/center_vnpt.service";
import departmentsServices from "../../services/department.service";
import unitsServices from "../../services/unit.service";
import Swal from "sweetalert2";
import FormWizard from "../../components/form/form-wizard.vue";
import {
  http_getAll,
  http_create,
  http_getOne,
  http_deleteOne,
  http_update,
} from "../../assets/js/common.http";
import {
  alert_success,
  alert_error,
  alert_delete,
  alert_warning,
  alert_delete_wide,
} from "../../assets/js/common.alert";
import SelectCDU from "../../components/box_lananh/select_cdu.vue";
import { Task } from "../common/import";
import employeeService from "../../services/employee.service";
import cycleService from "../../services/cycle.service";
import center_vnptService from "../../services/center_vnpt.service";
import { da } from "date-fns/locale";
import { formatDate } from "../common/import";
import {
  isDeleteEmployee,
  isEditEmployee,
  isReadEmployee,
  isCreateEmployee,
  isMail,
} from "../../use/getSessionItem";

export default {
  components: {
    Table,
    Pagination,
    Dropdown,
    Select,
    Search,
    // Add,
    DeleteAll,
    Edit,
    View,

    Select_Advanced,
    Add,
    Mail,
    FormWizard,
    SelectCDU,
  },
  setup(ctx) {
    const data = reactive({
      items: [
        {
          _id: "",
          name: "",
          postionId: "",
          Position: {
            _id: "",
            name: "",
          },
          unitId: "",
          Unit: {
            _id: "",
            name: "",
            Department: {
              _id: "",
              name: "",
              Center_VNPTHG: {
                _id: "",
                name: "",
              },
            },
          },
          Tasks: {
            start_date: "",
            end_date: "",
            content: "",
            _id: "",
            customerId: "",
            cycleId: "",
            leaderId: "",
            Employee_Task: {
              TaskId: "",
              EmployeeId: "",
            },
            Cycles: {
              _id: "",
              name: "",
            },
            Customers: {
              _id: "",
              name: "",
              avatar: "",
            },
            Status: {
              _id: "",
              status: "",
              reason: "",
            },
          },
        },
      ],
      entryValue: 5,
      numberOfPages: 1,
      totalRow: 0,
      startRow: 0,
      endRow: 0,
      currentPage: 1,
      searchText: "",
      activeEdit: false,
      editValue: {},

      viewValue: {
        _id: "",
        name: "",
        birthday: "",
        // avatar: "",
        address: "",
        phone: "",
        email: "",
        Position: {
          _id: "",
          name: "",
        },
        Unit: {
          _id: "",
          name: "",
          Department: {
            _id: "",
            name: "",
            Center_VNPTHG: {
              name: "",
              _id: "",
            },
          },
        },
        Tasks: {
          start_date: "",
          end_date: "",
          content: "",
          _id: "",
          customerId: "",
          cycleId: "",
          leaderId: "",
          Employee_Task: {
            TaskId: "",
            EmployeeId: "",
          },
          Cycles: {
            _id: "",
            name: "",
          },
          Customers: {
            _id: "",
            name: "",
            phone: "",
            email: "",
            address: "",
            avatar: "",
          },
          Status: {
            _id: "",
            name: "",
          },
        },
      },
      //***
      center: {},
      department: {},
      unit: {},
      position: {},

      selectAll: [
        {
          checked: false,
        },
      ],
      showActiveEdit: false,
      showActiveAdd: false,
      resetDataAdd: false,
    });

    const view = async (value) => {
      // FIND ONE employee
      data.viewValue = await employeeService.get(value);
      data.viewValue.birthday = formatDate(data.viewValue.birthday);
      for (let i = 0; i < data.viewValue.Tasks.length; i++) {
        data.viewValue.Tasks[i].start_date = formatDate(
          data.viewValue.Tasks[i].start_date
        );
        data.viewValue.Tasks[i].end_date = formatDate(
          data.viewValue.Tasks[i].end_date
        );
      }

      // console.log("sinh nhật:", data.viewValue.birthday);
    };
    // computed
    const add = () => {
      data.showActiveAdd = true;
    };
    const toString = computed(() => {
      if (data.choseSearch == "name") {
        return data.items.map((value, index) => {
          return [value.name].join("").toLocaleLowerCase();
        });
      } else if (data.choseSearch == "email") {
        return data.items.map((value, index) => {
          return [value.email].join("").toLocaleLowerCase();
        });
      } else if (data.choseSearch == "phone") {
        return data.items.map((value, index) => {
          return [value.phone].join("").toLocaleLowerCase();
        });
      } else {
        return data.items.map((value, index) => {
          return [value.name, value.email, value.phone]
            .join("")
            .toLocaleLowerCase();
        });
      }
    });
    const filter = computed(() => {
      return data.items.filter((value, index) => {
        return toString.value[index].includes(
          data.searchText.toLocaleLowerCase()
        );
      });
    });
    const filtered = computed(() => {
      if (!data.searchText) {
        data.totalRow = data.items.length;
        return data.items;
      } else {
        data.totalRow = filter.value.length;
        return filter.value;
      }
    });
    const setNumberOfPages = computed(() => {
      return Math.ceil(filtered.value.length / data.entryValue);
    });
    const setPages = computed(() => {
      if (data.items.length > 0) {
        if (setNumberOfPages.value == 0 || data.entryValue == "All") {
          data.entryValue = data.items.length;
          data.numberOfPages = 1;
        } else data.numberOfPages = setNumberOfPages.value;
        data.startRow = (data.currentPage - 1) * data.entryValue + 1;
        data.endRow = data.currentPage * data.entryValue;
        return filtered.value.filter((item, index) => {
          return (
            index + 1 > (data.currentPage - 1) * data.entryValue &&
            index + 1 <= data.currentPage * data.entryValue
          );
        });
      } else {
        //không tồn tại dữ liệu
        data.startRow = 0;
        data.endRow = 0;
        data.totalRow = 0;
        data.numberOfPages = 1;
        return data.items.value;
      }
    });
    const entryValuePosition = ref(""); //id
    const entryNamePosition = ref("Chức vụ"); //name
    const entryValueCenter = ref("");
    const entryNameCenter = ref("Trung tâm");
    const entryValueDepartment = ref(""); //id
    const entryNameDepartment = ref("Phòng"); //name
    const entryValueUnit = ref("");
    const entryNameUnit = ref("Tổ");

    //FRESH
    const refresh = async () => {
      data.items = await http_getAll(Employee);
      for (let value of data.items) {
        value.checked = false;
      }
      data.position = await http_getAll(Position);
      data.center = await CenterServices.getAll();
      if (entryValueCenter.value != "") {
        data.department = await departmentsServices.findAllDepOfACenter(
          entryValueCenter.value
        );
        data.department = data.department.map((value, index) => {
          return {
            ...value,
            value: value._id,
          };
        });
      } else {
        data.department = [];
      }
      if (entryValueDepartment.value != "") {
        data.unit = await unitsServices.findAllUnitsOfADep(
          entryValueDepartment.value
        );
        data.unit = data.unit.map((value, index) => {
          return {
            ...value,
            value: value._id,
          };
        });
      } else {
        data.unit = [];
      }

      data.position = data.position.map((value, index) => {
        return {
          ...value,
          value: value._id,
        };
      });
      data.center = data.center.map((value, index) => {
        return {
          ...value,
          value: value._id,
        };
      });

      // ***
      entryNamePosition.value = "Chức vụ";
      entryValuePosition.value = "";
      entryNameCenter.value = "Trung tâm";
      entryValueCenter.value = "";
      entryNameDepartment.value = "Phòng";
      entryValueDepartment.value = "";
      entryNameUnit.value = "Tổ";
      entryValueUnit.value = "";

      //***thay đổi
      for (let value of data.items) {
        for (let array of arrayCheck.data) {
          if (array._id == value._id) {
            value.checked = true;
            break;
          }
          value.checked = false;
        }
      }
      data.selectAll[0].checked = false;
    };
    const router = useRouter();

    // watch
    const activeMenu = ref(1);
    // methods
    const create = async () => {
      await refresh();
    };

    const edit = async (editValue) => {
      const result = await http_update(Employee, editValue._id, editValue);
      if (!result.error) {
        alert_success(`Sửa nhân viên`, `${result.msg}`);
        refresh();
      } else if (result.error) {
        alert_error(`Sửa nhân viên`, `${result.msg}`);
      }
    };

    // ******LỌC ******
    //POSITION
    watch(entryValuePosition, async (newValue, oldValue) => {
      if (newValue == "") {
        data.currentPage = 1;
        await refresh();
        return;
      }
      data.currentPage = 1;

      data.items = await http_getAll(Employee);
      //1.lấy danh sách nhân viên chức vụ x
      if (entryValuePosition.value.length > 0) {
        data.items = data.items.filter((val) => {
          return val.postionId == entryValuePosition.value;
        });
      }
      if (
        entryValueCenter.value != "" &&
        entryValueDepartment.value != "" &&
        entryValueDepartment.value != "1" &&
        entryValueUnit.value != "" &&
        entryValueUnit.value != "1"
      ) {
        data.items = data.items.filter((value) => {
          return (
            value.Unit.Department.Center_VNPTHG._id == entryValueCenter.value &&
            value.Unit.Department._id == entryValueDepartment.value &&
            value.unitId == entryValueUnit.value
          );
        });
      }
      //2. chọn 1 trung tâm và 1 phòng
      else if (
        entryValueCenter.value != "" &&
        entryValueDepartment.value != "" &&
        entryValueDepartment.value != "1"
      ) {
        data.items = data.items.filter((value) => {
          return (
            value.Unit.Department.Center_VNPTHG._id == entryValueCenter.value &&
            value.Unit.Department._id == entryValueDepartment.value
          );
        });
      } else if (entryValueCenter.value != "") {
        data.items = data.items.filter((val) => {
          return (
            val.Unit.Department.Center_VNPTHG._id == entryValueCenter.value
          );
        });
      }
      //Thay đổi
      data.selectAll[0].checked = false;
      for (let value of data.items) {
        value.checked = false;
      }
      for (let value of data.items) {
        for (let array of arrayCheck.data) {
          if (array._id == value._id) {
            value.checked = true;
            break;
          }
          value.checked = false;
        }
      }
    });
    const updateEntryValuePosition = (value) => {
      entryValuePosition.value = value;
    };
    //  CENTER
    watch(entryValueCenter, async (newValue, oldValue) => {
      if (newValue == "") {
        data.currentPage = 1;
        await refresh();
        return;
      }
      data.currentPage = 1;
      entryValueDepartment.value = "1"; //id
      entryNameDepartment.value = "Phòng"; //name
      entryValueUnit.value = "1"; //id
      entryNameUnit.value = "Tổ"; //name
      //Lấy tất cả nhân viên
      data.items = await http_getAll(Employee);
      //Lấy tất cả phòng của 1 trung tâm

      data.department = await departmentsServices.findAllDepOfACenter(newValue);

      data.department = data.department.map((value, index) => {
        return {
          ...value,
          value: value._id,
        };
      });

      data.unit = [];

      data.unit = data.unit.map((value, index) => {
        return {
          ...value,
          value: value._id,
        };
      });

      //Lọc
      // 1. có chức vụ và trung tâm
      if (entryValueCenter.value != "" && entryValuePosition.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.Unit.Department.Center_VNPTHG._id == entryValueCenter.value &&
            value.postionId == entryValuePosition.value
          );
        });
      }
      //2.  chỉ có trung tâm
      else {
        data.items = data.items.filter((value, index) => {
          return (
            value.Unit.Department.Center_VNPTHG._id == entryValueCenter.value
          );
        });
      }
      data.selectAll[0].checked = false;
      for (let value of data.items) {
        value.checked = false;
      }
      for (let value of data.items) {
        for (let array of arrayCheck.data) {
          if (array._id == value._id) {
            value.checked = true;
            break;
          }
          value.checked = false;
        }
      }
    });
    //UpdateEntryValueCenter
    const updateEntryValueCenter = (value) => {
      entryValueCenter.value = value;
    };

    //DEP
    watch(entryValueDepartment, async (newValue, oldValue) => {
      if (newValue == "") {
        data.currentPage = 1;
        await refresh();
        return;
      } else if (newValue == "1") {
        return;
      }
      data.currentPage = 1;
      entryValueUnit.value = "1"; //id
      entryNameUnit.value = "Tổ"; //name

      //Lấy tất cả nhân vien
      data.items = await http_getAll(Employee);
      //Lấy tất cả tổ của 1 phòng
      data.unit = await unitsServices.findAllUnitsOfADep(newValue);
      data.unit = data.unit.map((value, index) => {
        return {
          ...value,
          value: value._id,
        };
      });
      //Lọc
      //1. có trung tâm, phòng, chức vụ
      if (entryValuePosition.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.Unit.Department.Center_VNPTHG._id == entryValueCenter.value &&
            value.Unit.Department._id == entryValueDepartment.value &&
            value.postionId == entryValuePosition.value
          );
        });
      }
      // 2. có trung tâm và phòng
      else {
        data.items = data.items.filter((value, index) => {
          return (
            value.Unit.Department.Center_VNPTHG._id == entryValueCenter.value &&
            value.Unit.Department._id == entryValueDepartment.value
          );
        });
      }
      //Thay đổi
      for (let value of data.items) {
        value.checked = false;
      }
      for (let value of data.items) {
        for (let array of arrayCheck.data) {
          if (array._id == value._id) {
            value.checked = true;
            break;
          }
          value.checked = false;
        }
      }
    });
    const updateEntryValueDepartment = (value) => {
      entryValueDepartment.value = value;
    };

    //UNIT
    watch(entryValueUnit, async (newValue, oldValue) => {
      if (newValue == "") {
        data.currentPage = 1;
        await refresh();
        return;
      } else if (newValue == "1") {
        return;
      }
      data.currentPage = 1;
      data.items = await http_getAll(Employee);
      //filter
      //1.  position
      if (entryValuePosition.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.Unit.Department.Center_VNPTHG._id == entryValueCenter.value &&
            value.Unit.Department._id == entryValueDepartment.value &&
            value.postionId == entryValuePosition.value &&
            value.unitId == entryValueUnit.value
          );
        });
      }
      //2. center,department, unit
      else {
        data.items = data.items.filter((value, index) => {
          return (
            value.Unit.Department.Center_VNPTHG._id == entryValueCenter.value &&
            value.Unit.Department._id == entryValueDepartment.value &&
            value.unitId == entryValueUnit.value
          );
        });
      }
      //Thay đổi
      data.selectAll[0].checked = false;
      for (let value of data.items) {
        value.checked = false;
      }
      for (let value of data.items) {
        for (let array of arrayCheck.data) {
          if (array._id == value._id) {
            value.checked = true;
            break;
          }
          value.checked = false;
        }
      }
    });

    const updateEntryValueUnit = (value) => {
      entryValueUnit.value = value;
    };

    //SelectAll
    //***
    const arrayCheck = reactive({ data: [] });

    const handleSelectAll = (value) => {
      arrayCheck.data = [];
      if (value == false) {
        for (let value1 of data.items) {
          value1.checked = true;
          arrayCheck.data.push(value1);
        }
      } else {
        for (let value1 of data.items) {
          value1.checked = false;
          const index = arrayCheck.data.indexOf(value1._id);
          if (index !== -1) {
            arrayCheck.data.splice(index, 1);
          }
        }
      }
    };
    const handleSelectOne = (id, item) => {
      if (item.checked == false) {
        arrayCheck.data.push(item);
      } else {
        arrayCheck.data = arrayCheck.data.filter((value, index) => {
          return value._id != id;
        });
      }
      data.selectAll[0].checked = false;
    };

    // HANDLE DELETE
    const handleDelete = async (id, item) => {
      const isConfirmed = await alert_delete(
        "Xóa",
        `Bạn có chắc là xóa nhân viên <span style="color: blue;"> ${item.name} </span> không!!`
      );
      if (isConfirmed) {
        const rsEmployee = await http_deleteOne(Employee, id);

        if (rsEmployee.error) {
          alert_error("Lỗi ", rsEmployee.msg);
        } else {
          refresh();
          alert_success("Thành công", "Xóa nhân viên thành công");
        }
      }
    };
    const deleteMany = async () => {
      try {
        //Mảng nhân viên sẽ xóa
        // const deleteArray = data.items.filter((value, index) => {
        //   return value.checked == true;
        // });
        if (arrayCheck.data.length == 0) {
          alert_warning("Bạn chưa chọn nhân viên", "");
          return;
        }
        let contentAlert = `<p>Bạn có muốn xoá tất cả nhân viên này không?
          </p><p>Tổng số nhân viên sẽ xoá là:
           <span style="color: blue;">${arrayCheck.data.length}</span></p>
            <table class="table table-bordered">
        <thead>
          <tr>
            <th>Tên nhân viên</th>
            <th>Chức vụ</th>
            <th>Tổ</th>
          </tr>
        </thead> <tbody>`;
        for (let value of arrayCheck.data) {
          contentAlert += `<tr>
            <td>${value.name}</td>
            <td>${value.Position.name}</td>
            <td>
              ${value.Unit.name}
            </td>
          </tr>`;
        }
        contentAlert += `</tbody>
      </table>`;
        const isConfirmed = await alert_delete_wide(
          `Xoá nhiều nhân viên`,
          contentAlert
        );
        if (isConfirmed) {
          let checkDeleteAll = false;
          for (let valueDelete of arrayCheck.data) {
            const rsEmployee = await http_deleteOne(Employee, valueDelete._id);
            if (rsEmployee.error) {
              alert_error("Lỗi ", rsEmployee.msg);
              checkDeleteAll = false;
            } else {
              checkDeleteAll = true;
            }
          }
          if (checkDeleteAll) {
            refresh();
            alert_success("Thành công", "Xóa nhân viên thành công");
            arrayCheck.data = [];
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    // ***
    const updateCenter = async (value) => {
      data.center = await center_vnptService.getAll();
      data.center = data.center.map((value, index) => {
        return {
          ...value,
          value: value._id,
        };
      });
    };
    const updateDepartment = async (value) => {
      if (entryValueCenter.value != "") {
        data.department = await departmentsServices.findAllDepOfACenter(
          entryValueCenter.value
        );
        data.department = data.department.map((value, index) => {
          return {
            ...value,
            value: value._id,
          };
        });
      }

      // data.department = value;
    };
    const updateUnit = async (value) => {
      if (entryValueDepartment.value != "") {
        data.unit = await unitsServices.findAllUnitsOfADep(
          entryValueDepartment.value
        );
        data.unit = data.unit.map((value, index) => {
          return {
            ...value,
            value: value._id,
          };
        });
      }
    };
    const updatePosition = async (value) => {
      data.position = await Position.getAll();
      data.position = data.position.map((value, index) => {
        return {
          ...value,
          value: value._id,
        };
      });
    };
    const mail = ref(false);
    const showMail = () => {
      const count = data.items.filter(
        (element) => element.checked === true
      ).length;

      if (count > 0) {
        mail.value = true;
      } else {
        mail.value = false;
        alert_warning("Bạn chưa chọn nhân viên", "");
      }
    };
    const sendEmail = async (value) => {
      const dataMail = reactive({ title: "", content: "", mail: "" });
      dataMail.title = value.title;
      dataMail.content = value.content;

      let timerInterval;
      Swal.fire({
        title: "Mail đang gửi",
        html: "Bạn vui lòng đợi <b></b> mili giây.",
        timer: arrayCheck.data.length * 2100,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const b = Swal.getHtmlContainer().querySelector("b");
          timerInterval = setInterval(() => {
            b.textContent = Swal.getTimerLeft();
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
        }
      });

      for (let i = 0; i < arrayCheck.data.length; i++) {
        if (arrayCheck.data[i].checked == true) {
          try {
            dataMail.mail = arrayCheck.data[i].email;
            await mailService.sendmail(dataMail);
          } catch (error) {
            console.error("Error sending email:", error);
          }
        }
        await refresh();
      }
      alert_success("Mail đã được gửi", "");
    };

    onBeforeMount(async () => {
      await refresh();
    });

    return {
      data,
      setPages,
      activeMenu,
      create,
      edit,
      refresh,
      sendEmail,
      updateCenter,
      updateDepartment,
      updateUnit,
      updatePosition,
      mail,
      showMail,
      view,

      entryValuePosition,
      entryNamePosition,
      entryValueCenter,
      entryNameCenter,
      entryValueDepartment,
      entryNameDepartment,
      entryValueUnit,
      entryNameUnit,

      updateEntryValuePosition,
      updateEntryValueCenter,
      updateEntryValueDepartment,
      updateEntryValueUnit,

      handleDelete,
      deleteMany,
      handleSelectAll,

      handleSelectOne,
      add,

      // phân quyền
      isDeleteEmployee,
      isEditEmployee,
      isReadEmployee,
      isCreateEmployee,
      isMail,
    };
  },
};
</script>

<template>
  <div class="border-box d-flex flex-column ml-2">
    <div class="d-flex flex-column mt-3">
      <!-- LỌC  -->
      <span class="mx-3 mb-3 h6">Lọc nhân viên</span>
      <div class="d-flex mx-3">
        <div class="form-group w-100 mr-2">
          <Select
            :title="`Chức vụ`"
            :entryValue="entryNamePosition"
            :options="data.position"
            @update:entryValue="
              (value, value1) => (
                updateEntryValuePosition(value),
                (entryNamePosition = value1.name)
              )
            "
            @refresh="
              (entryNamePosition = 'Chọn chức vụ'),
                updateEntryValuePosition(''),
                (data.currentPage = 1)
            "
            style="height: 35px"
          />
        </div>
        <div class="form-group w-100 mr-2">
          <Select
            :title="`Trung tâm`"
            :entryValue="entryNameCenter"
            :options="data.center"
            @update:entryValue="
              (value, value1) => (
                updateEntryValueCenter(value), (entryNameCenter = value1.name)
              )
            "
            @refresh="
              (entryNameCenter = 'Chọn trung tâm'),
                updateEntryValueCenter(''),
                (data.currentPage = 1)
            "
            style="height: 35px"
          />
        </div>
        <!-- Phòng -->
        <div class="form-group w-100 mr-2">
          <Select
            :title="`Phòng`"
            :entryValue="entryNameDepartment"
            :options="data.department"
            @update:entryValue="
              (value, value1) => (
                updateEntryValueDepartment(value),
                (entryNameDepartment = value1.name)
              )
            "
            @refresh="
              (entryNameDepartment = 'Chọn phòng'),
                updateEntryValueDepartment(''),
                (data.currentPage = 1)
            "
            style="height: 35px"
          />
        </div>
        <div class="form-group w-100">
          <Select
            :title="`Tổ`"
            :entryValue="entryNameUnit"
            :options="data.unit"
            @update:entryValue="
              (value, value1) => (
                updateEntryValueUnit(value), (entryNameUnit = value1.name)
              )
            "
            @refresh="
              (entryNameUnit = 'Chọn tổ'),
                updateEntryValueUnit(''),
                (data.currentPage = 1)
            "
            style="height: 35px"
          />
        </div>
      </div>
    </div>
    <!--  -->
    <div class="border-hr mb-3"></div>
    <div class="d-flex justify-content-between mx-3 mb-3">
      <div class="d-flex justify-content-start">
        <Select
          class="d-flex justify-content-start"
          :options="[
            {
              name: 5,
              value: 5,
            },
            {
              name: 10,
              value: 10,
            },
            {
              name: 20,
              value: 20,
            },
            {
              name: 30,
              value: 30,
            },
          ]"
          style="width: 125px"
          :title="`Số bản ghi`"
          @update:entryValue="(value) => (data.entryValue = value)"
          :entryValue="data.entryValue"
          @refresh="(data.entryValue = 'All'), (data.currentPage = 1)"
        />
        <Search
          class="ml-3"
          style="width: 300px"
          @update:searchText="(value) => (data.searchText = value)"
          :entryValue="data.searchText"
          @choseSearch="
            async (value) => (
              (data.choseSearch = value), (data.currentPage = 1)
            )
          "
          @refresh="(data.entryValue = 'All'), (data.currentPage = 1)"
          :options="[
            {
              _id: 'name',
              name: 'Tìm kiếm theo tên',
            },
            {
              _id: 'email',
              name: 'Tìm kiếm theo email',
            },
            {
              _id: 'phone',
              name: 'Tìm kiếm theo số điện thoại',
            },
          ]"
        />
      </div>
      <div class="d-flex align-items-start">
        <button
          type="button"
          class="btn btn-warning ml-3 mr-3"
          data-toggle="modal"
          data-target="#model-form-mail"
          @click="showMail"
          :disabled="isMail() ? false : true"
        >
          <span class="mx-2" style="color: white">Mail</span>
        </button>
        <Mail v-if="mail" @sendEmail="(value) => sendEmail(value)"></Mail>
        <button
          type="button"
          class="btn btn-danger mr-3"
          data-toggle="modal"
          data-target="#model-delete-all"
          @click="deleteMany()"
          :disabled="isDeleteEmployee() ? false : true"
        >
          <span id="delete-all" class="mx-2"
            ><span class="size-16">Xoá</span></span
          >
        </button>
        <!-- Thêm -->

        <button
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#model-form-wizard"
          @click="(data.resetDataAdd = true), add()"
          :disabled="isCreateEmployee() ? false : true"
        >
          <span id="add" class="mx-2">Thêm</span>
        </button>
        <Add
          v-if="data.showActiveAdd"
          :resetData="data.resetDataAdd"
          @create="(data.resetDataAdd = false), create()"
          @newPosition="
            (value) => {
              updatePosition(value);
            }
          "
          @newCenter="
            (value) => {
              updateCenter(value);
            }
          "
          @newDep="(value) => updateDepartment(value)"
          @newUnit="(value) => updateUnit(value)"
          @refresh="
            async () => {
              await refresh();
              data.showActiveAdd = false;
            }
          "
        />
      </div>
    </div>
    <!-- Table -->
    <Table
      :items="setPages"
      :fields="[
        'Tên',
        'Sđt',
        'Email',
        'Chức vụ',
        'Đơn vị',
        'Phòng',
        'Trung tâm',
      ]"
      :selectAll="data.selectAll"
      :startRow="data.startRow"
      @selectAll="(value) => handleSelectAll(value)"
      @selectOne="(id, item) => handleSelectOne(id, item)"
      @delete="handleDelete"
      @edit="
        (value, value1) => (
          (data.editValue = value),
          (data.activeEdit = value1),
          (data.showActiveEdit = true)
        )
      "
      @view="
        (value) => {
          view(value);
        }
      "
      :showActionList="[
        isReadEmployee() ? true : false,
        isEditEmployee() ? true : false,
        isDeleteEmployee() ? true : false,
      ]"
    />

    <!-- Pagination -->
    <Pagination
      :numberOfPages="data.numberOfPages"
      :totalRow="data.totalRow"
      :startRow="data.startRow"
      :endRow="data.endRow"
      :currentPage="data.currentPage"
      @update:currentPage="(value) => (data.currentPage = value)"
      class="mx-3"
    />
    <Edit
      v-if="data.showActiveEdit"
      :item="data.editValue"
      :class="[data.activeEdit ? 'show-modal' : 'd-none']"
      @cancel="data.activeEdit = false"
      :position="data.items.postionId"
      :unit="data.items.unitId"
      @edit="edit(data.editValue)"
      @refresh="
        async () => {
          await refresh();
          data.showActiveEdit = false;
        }
      "
    />

    <View :item="data.viewValue" />
  </div>
</template>

<style scoped>
.border-box {
  border: 1px solid var(--gray);
  border-radius: 5px;
}
.menu {
  /* border: 1px solid var(--gray); */
  border-collapse: collapse;
}
.menu a {
  border: 1px solid var(--gray);
  border-collapse: collapse;
  padding: 8px 12px;
  font-size: 15px;
}
.active-menu {
  color: blue;
}
.none-active-menu {
  color: var(--dark);
}
.border-hr {
  border-top: 1px solid var(--gray);
}
#add,
#delete-all {
  font-size: 14px;
}

.form-control {
  background-color: inherit;
  border: 1px solid var(--gray);
}
@media screen and (max-width: 739px) {
  .select {
    width: 90px;
  }
  .search {
    width: 210px;
    margin-left: 2px !important ;
    margin-right: 2px;
  }
  .border-box {
    width: 1000px;
    margin-right: 50px !important;
  }
  .menu {
    padding: 0;
  }
}
@media screen and (max-width: 992px) {
  .select {
    width: 90px;
  }
  .search {
    width: 210px;
    margin-left: 2px !important ;
    margin-right: 2px;
  }
  .border-box {
    width: 100%;
    margin-left: 10px;
  }
}
</style>
