<template>
  <div class="border-box d-flex flex-column ml-2">
    <!-- Menu -->

    <div class="report_container">
      <div
        class="mx-1 report__item"
        :style="data.activeMenu == 2 ? { border: '1px solid blue' } : {}"
      >
        <router-link
          :to="!isReadReport() ? '#' : '/report'"
          :class="[data.activeMenu == 2 ? 'active-menu' : 'none-active-menu']"
          class=""
        >
          <span class=""> Khách hàng lâu chưa chăm sóc</span>
          <span class="pl-3" style="margin-top: -4px">
            <span class="material-symbols-outlined"> group </span>
            <span class="text-center"
              >{{ store.countReport }}/{{ store.countCustomer }}</span
            >
          </span>
        </router-link>
      </div>
      <div
        class="mx-1 report__item"
        :style="data.activeMenu == 1 ? { border: '1px solid blue' } : {}"
      >
        <!-- to="/report_assignment_staff" -->
        <router-link
          :to="!isReadReportAssinmentStaff() ? '#' : '/report_assignment_staff'"
          :class="[data.activeMenu == 1 ? 'active-menu' : 'none-active-menu']"
          class=""
        >
          <span class=""> Khách hàng do nhân viên chăm sóc </span>
          <span class="pl-3" style="margin-top: -4px">
            <span class="material-symbols-outlined"> group </span>
            <span class="text-center"
              >{{ store.countReportAssignmentStaff }}/{{
                store.countCustomer
              }}</span
            >
          </span>
        </router-link>
      </div>

      <div
        class="mx-1 report__item"
        :style="data.activeMenu == 0 ? { border: '1px solid blue' } : {}"
      >
        <router-link
          :to="!isReadReportCustomerCycle() ? '#' : '/report_customer_cycle'"
          :class="[data.activeMenu == 0 ? 'active-menu' : 'none-active-menu']"
          class=""
        >
          <span> Khách hàng tới chu kì nhưng chưa chăm sóc </span>
          <span class="pl-3" style="margin-top: -4px">
            <span class="material-symbols-outlined"> group </span>
            <span class="text-center"
              >{{ store.countReportCustomerCycle }}/{{
                store.countCustomer
              }}</span
            >
          </span>
        </router-link>
      </div>

      <div
        class="mx-1 report__item"
        :style="data.activeMenu == 3 ? { border: '1px solid blue' } : {}"
      >
        <router-link
          :to="!isReadReportLeaderCustomer() ? '#' : '/report_leader_customer'"
          :class="[data.activeMenu == 3 ? 'active-menu' : 'none-active-menu']"
          class=""
        >
          <span class=""> Khách hàng do lãnh đạo phụ trách </span>
          <span class="pl-3" style="margin-top: -4px">
            <span class="material-symbols-outlined"> group </span>
            <span class="text-center"
              >{{ store.countLeaderCustomer }}/{{ store.countCustomer }}</span
            >
          </span>
        </router-link>
      </div>
      <div
        class="mx-1 report__item"
        :style="data.activeMenu == 4 ? { border: '1px solid blue' } : {}"
      >
        <router-link
          :to="!isReadReportLeaderStaff() ? '#' : '/report_leader_staff'"
          :class="[data.activeMenu == 4 ? 'active-menu' : 'none-active-menu']"
          class=""
        >
          <span class=""> Nhân viên do lãnh đạo phụ trách </span>
          <span class="pl-3" style="margin-top: -4px">
            <span class="material-symbols-outlined"> group </span>
            <span class="text-center"
              >{{ store.countleaderStaff }}/{{ store.countEmployee }}</span
            >
          </span>
        </router-link>
      </div>
    </div>
    <div class="border-hr my-3"></div>
    <!-- Filter -->
    <div class="d-flex flex-column">
      <span class="mx-3 mb-3 h6 size-18">Lọc theo thời gian</span>
      <div class="d-flex mx-3">
        <div class="form-group w-100">
          <!-- entryValue = modelValue -->
          <InputFilter
            @update:entryValue="(value) => (startDateValue = value)"
            :title="`Ngày bắt đầu`"
            :entryValue="`Ngày bắt đầu`"
            style="height: 35px"
          />
        </div>
        <div class="form-group w-100 ml-3">
          <InputFilter
            @update:entryValue="(value) => (endDateValue = value)"
            :title="`Ngày kết thúc`"
            :entryValue="`Ngày kết thúc`"
            style="height: 35px"
          />
        </div>
      </div>
    </div>
    <!-- Search -->
    <div class="border-hr my-3"></div>
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
          @update:entryValue="handleUpdateEntryValue"
          :entryValue="data.entryValue"
          @refresh="data.entryValue = 'All'"
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
          class="btn btn-warning mx-2"
          data-toggle="modal"
          data-target="#model-form-mail"
          :disabled="isMail() ? false : true"
        >
          <span id="delete-all" class="">Mail</span>
        </button>
        <button
          type="button"
          :disabled="isPrintReport() ? false : true"
          class="btn btn-primary"
          @click="handlePrintReport"
        >
          <span id="add" class="">In</span>
        </button>
      </div>
    </div>

    <!-- Table -->
    <Table
      :items="setPages"
      :fields="[
        'Tên',
        'Email',
        'Sdt',
        'Công việc',
        'Công ty',
        'Loại khách hàng',
      ]"
      :labels="[
        'nameCustomer',
        'emailCustomer',
        'phoneCustomer',
        'current_position',
        'nameCompany',
        'nameCustomerType',
      ]"
      @delete="handleDelete"
      @edit="EditEmit"
      :showActionList="[true, false, false]"
      :startRow="data.startRow"
      @view="view"
      :isActiveCheckbox="false"
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

    <div class="container pdf-content" ref="pdfContentRef">
      <img
        src="../../assets/images/vnpt-logo1.png"
        class="rounded-circle"
        alt="Cinque Terre"
        style="height: 70px"
      />
      <div class="d-flex justify-content-between mt-4">
        <p class="text-center ml-4 font-weight-bold">VNPT Hậu Giang</p>
        <div class="text-center font-weight-bold" style="margin-top: -40px">
          <p>CỘNG HÒA XÃ HỘI CHỦ NGHỈA VIỆT NAM</p>
          <p>Độc lập - Tự do - Hạnh phúc</p>
          <p>-----------------</p>
        </div>
      </div>
      <div class="float-right">
        <p>....ngày....tháng....năm</p>
      </div>
      <div class="text-center mt-4 font-weight-bold">
        <h3 class="font-weight-bold text-center">
          Báo Cáo <br />
          Danh Sách Khách Hàng Đã Lâu Chưa Chăm Sóc
        </h3>
      </div>
      <div class="">
        <span>Họ tên: ................................</span>
        <br />
        <span>Chức vụ: .............................</span>
        <br />
        <span>Bộ phận công tác: ............</span>
      </div>
      <table class="table table-bordered mt-4">
        <thead>
          <tr>
            <th v-for="(value, index) in labels" :key="index">{{ value }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data.items" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.nameCustomer }}</td>
            <td>{{ item.emailCustomer }}</td>
            <td>{{ item.phoneCustomer }}</td>
            <td>{{ item.nameCustomerType }}</td>
          </tr>
        </tbody>
      </table>
      <div class="d-flex justify-content-around mt-4">
        <p>Phụ trách bộ phận</p>
        <p>Người Báo Cáo</p>
      </div>
    </div>
    <View
      :item="data.viewValue"
      :itemViewCareCus="data.viewCareCus"
      :Events="data.Events"
    />
    <Mail />
  </div>
</template>

<script>
import { reactive, computed, ref, onBeforeMount, watch } from "vue";
import Table from "../../components/table/table-report.vue";
import Mail from "./mail.vue";
import {
  http_getAll,
  Pagination,
  Select,
  Search,
  Customer_Work,
  formatDateTime,
  formatDateTime_2,
  formatDate,
  Task,
} from "../common/import";

import {
  isReadReport,
  isReadReportLeaderCustomer,
  isReadReportLeaderStaff,
  isReadReportCustomerCycle,
  isReadReportAssinmentStaff,
  isPrintReport,
  isMail,
} from "../../use/getSessionItem";

import { isEqual, isBefore, isAfter, isSameDay } from "date-fns";

import {
  countCustomer,
  countEmployee,
  countElementReportPage,
  countElementReportCustomerCyclePage,
  countElementReportAssignmentStaff,
  countElementReportLeaderCustomer,
  countElementReportLeaderStaff,
} from "./use/index";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import View from "./view.vue";
import InputFilter from "../../components/form/form_filter_truc.vue";

export default {
  components: {
    Table,
    Pagination,
    Select,
    Search,
    View,
    Mail,
    InputFilter,
  },
  setup() {
    const store = reactive({
      countCustomer: 0,
      countEmployee: 0,
      countReport: 0,
      countReportAssignmentStaff: 0,
      countReportCustomerCycle: 0,
      countLeaderCustomer: 0,
      countleaderStaff: 0,
    });
    const data = reactive({
      Events: [],
      items: [],
      entryValue: 5, // total record in page
      numberOfPages: 1,
      totalRow: 0, // total row data
      startRow: 0,
      endRow: 0,
      currentPage: 1,
      searchText: "",
      activeMenu: 2,
      viewValue: {
        Customer: {
          name: "",
          birthday: "",
          avatar: "",
          phone: "",
          email: "",
          address: "",
        },
        Customer_Type: {
          name: "",
        },
        Company_KH: {
          name: "",
        },
        Events: [
          {
            name: "",
            content: "",
            time_duration: "",
          },
        ],
        Habits: [
          {
            name: "",
          },
        ],
        current_workplace: "",
        work_history: "",
        current_position: "",
        work_temp: "",
      },
      viewCareCus: null,
      lengthCustomer: 0,
    });

    const labels = [
      "STT",
      "Tên khách hàng",
      "Email",
      "Số điện thoại",
      "Loại khách hàng",
    ];

    const startDateValue = ref("");
    const endDateValue = ref("");

    const reFresh = async () => {
      store.countCustomer = await countCustomer();
      store.countEmployee = await countEmployee();
      store.countReport = await countElementReportPage();
      store.countReportAssignmentStaff =
        await countElementReportAssignmentStaff();
      store.countReportCustomerCycle =
        await countElementReportCustomerCyclePage();
      store.countLeaderCustomer = await countElementReportLeaderCustomer();
      store.countleaderStaff = await countElementReportLeaderStaff();

      const cusWork = await http_getAll(Customer_Work);
      const tasks = await http_getAll(Task);

      data.lengthCustomer = cusWork.documents.length;
      data.items = cusWork.documents.filter((cusWork) => {
        const taskCusCared = cusWork.Customer.Tasks.filter((task) => {
          if (task.Status_Task.name == "đã chăm sóc") {
            // lấy các khách hàng đã chăm sóc
            const cycle = task.Cycle.name; // lấy chu kì
            let start_date = task.start_date; // lấy ngày bắt đầu
            let end_date = task.end_date;
            start_date = new Date(start_date); // chuyển chuổi sang date

            end_date = new Date(end_date);

            end_date =
              end_date.getFullYear() +
              "-" +
              (end_date.getMonth() + 1) +
              "-" +
              end_date.getDate();

            let numberOfCycle = cycle.replace(/\D/g, ""); // lấy số trong chu kì

            numberOfCycle = +numberOfCycle; // ép kiểu sang số nguyên

            var cycleDate = 0;
            var cycleMonth = 0;
            var cycleYear = 0;
            switch (true) {
              case cycle.includes("ngày"):
                cycleDate = numberOfCycle; // Nửa sửa bỏ nhân 2
                break;
              case cycle.includes("tháng"):
                cycleMonth = numberOfCycle; // Nửa sửa bỏ nhân 2
                break;
              case cycle.includes("năm"):
                cycleYear = numberOfCycle; // Nửa sửa bỏ nhân 2
                break;
              case cycle.includes("tuần"):
                cycleDate = numberOfCycle * 7;
                break;
              case cycle.includes("quý"):
                cycleDate = 90;
              case cycle.includes("quí"):
                cycleDate = 90;
            }

            // lần bắt đầu đầu tiên
            start_date.setDate(start_date.getDate() + cycleDate);
            start_date.setMonth(start_date.getMonth() + cycleMonth);
            start_date.setFullYear(start_date.getFullYear() + cycleYear);
            const year = start_date.getFullYear();
            const month = start_date.getMonth() + 1;
            const day = start_date.getDate();
            let dayStartNewCycle = year + "-" + month + "-" + day; // ngày bắt đầu chu kì mới

            if (isAfter(new Date(dayStartNewCycle), new Date(end_date))) {
              // cycleDate = cycleDate * 2;
            }

            if (dayStartNewCycle == end_date) {
              dayStartNewCycle = new Date(dayStartNewCycle);
              dayStartNewCycle.setDate(dayStartNewCycle.getDate() + 1);
              dayStartNewCycle =
                dayStartNewCycle.getFullYear() +
                "-" +
                (dayStartNewCycle.getMonth() + 1) +
                "-" +
                dayStartNewCycle.getDate();
              // cycleDate = cycleDate * 2;
            }

            if (isBefore(new Date(dayStartNewCycle), new Date(end_date))) {
              let end_day = new Date(end_date);
              end_day.setDate(end_day.getDate() + 1);
              dayStartNewCycle =
                end_day.getFullYear() +
                "-" +
                (end_day.getMonth() + 1) +
                "-" +
                end_day.getDate();
              // cycleDate = cycleDate * 2 + 1;
            }

            // // lần bắt đầu thứ 2

            // console.log('Day start new cycle before: ' + dayStartNewCycle);
            const dayCycle2 = new Date(dayStartNewCycle);
            // console.log('Cycle month: ' + cycleMonth);
            // console.log('Cycle date: ' + cycleDate);
            // console.log(' cycleYear: ' + cycleYear);
            dayCycle2.setDate(dayCycle2.getDate() + cycleDate);
            dayCycle2.setMonth(dayCycle2.getMonth() + cycleMonth);
            dayCycle2.setFullYear(dayCycle2.getFullYear() + cycleYear);
            // console.log('Day start new cycle after: ' + dayCycle2);

            const year2 = dayCycle2.getFullYear();
            const month2 = dayCycle2.getMonth() + 1;
            const day2 = dayCycle2.getDate();

            const dayStartNewCycle2 = year2 + "-" + month2 + "-" + day2;

            task.dayStartNewCycle2 = dayStartNewCycle2;
            task.dayStartNewCycle = dayStartNewCycle;
            return task;
          }
        });

        const rsTaskCusCared = taskCusCared.filter((value, index) => {
          let dayStartNewCycle2 = new Date(value.dayStartNewCycle2);
          let dayStartNewCycle = new Date(value.dayStartNewCycle);

          let currentDay = new Date();
          if (value.customerId == cusWork.Customer._id) {
            return cusWork.Customer.Tasks.filter((task) => {
              let start_date = new Date(task.start_date);

              if (
                value.customerId == cusWork.Customer._id &&
                (isAfter(dayStartNewCycle2, currentDay) ||
                  isEqual(dayStartNewCycle2, currentDay)) &&
                !isEqual(dayStartNewCycle2, start_date) &&
                !isEqual(dayStartNewCycle, start_date) &&
                task.Status_Task.name == "đã chăm sóc"
              ) {
                // console.log('Report ', task);
                return task;
              }
            });
          }
        });

        if (rsTaskCusCared.length > 0) {
          const filteredTasks = rsTaskCusCared.filter((taskCusCared) => {
            const matchingTasks = tasks.filter((task) => {
              return taskCusCared.customerId === task.customerId;
            });

            const hasOtherTasks = matchingTasks.some(
              // lấy
              (task) => task.Status_Task.name !== "đã chăm sóc"
            );

            if (hasOtherTasks) {
              return false; // Không trả về nếu có task khác đã chăm sóc
            }

            return taskCusCared;
          });

          // console.log("All tasks", filteredTasks);
          if (filteredTasks.length > 0) {
            return filteredTasks;
          }
        }
      });

      // format lại data items

      data.items = data.items.map((item) => {
        return {
          nameCustomer: item.Customer.name,
          emailCustomer: item.Customer.email,
          phoneCustomer: item.Customer.phone,
          current_position: item.current_position,
          nameCustomerType: item.Customer.Customer_Type.name,
          nameCompany: item.Company_KH.name,
          Events: [...item.Customer.Events],
          Tasks: [...item.Customer.Tasks],
          Habits: {
            ...item.Customer.Habits,
          },
          ...item,
        };
      });

      if (startDateValue.value.length > 0) {
        data.items = data.items.filter((item) => {
          return (
            item.Tasks.filter((task) => {
              return (
                new Date(task.start_date).getTime() ===
                  new Date(startDateValue.value).getTime() ||
                (new Date(task.start_date).getTime() >=
                  new Date(startDateValue.value).getTime() &&
                  new Date(task.start_date).getTime() <=
                    new Date(endDateValue.value).getTime())
              );
            }).length > 0
          );
        });

        // console.log('Rs', rs);
      }

      if (endDateValue.value.length > 0) {
        data.items = data.items.filter((item) => {
          return (
            item.Tasks.filter((task) => {
              return (
                new Date(task.end_date).toLocaleDateString() ===
                  new Date(endDateValue.value).toLocaleDateString() ||
                (new Date(task.start_date).getTime() >=
                  new Date(startDateValue.value).getTime() &&
                  new Date(task.start_date).getTime() <=
                    new Date(endDateValue.value).getTime())
              );
            }).length > 0
          );
        });
      }
    };

    // Begin watch
    watch(startDateValue, (newValue, oldValue) => {
      if (newValue != "") {
        data.currentPage = 1;
        reFresh();
      } else {
        data.currentPage = 1;
        reFresh();
      }
    });

    watch(endDateValue, (newValue, oldValue) => {
      if (newValue != "") {
        data.currentPage = 1;
        reFresh();
      } else {
        data.currentPage = 1;
        reFresh();
      }
    });

    // End watch

    // handle update entry value
    const handleUpdateEntryValue = (value) => {
      data.entryValue = value;
    };

    //handle update search text
    const handleUpdateSearchText = (value) => {
      data.searchText = value;
    };

    // handle pagination
    const toString = computed(() => {
      // console.log("Starting search");
      if (data.choseSearch == "name") {
        return data.items.map((value, index) => {
          return [value.nameCustomer].join("").toLocaleLowerCase();
        });
      } else if (data.choseSearch == "email") {
        return data.items.map((value, index) => {
          return [value.emailCustomer].join("").toLocaleLowerCase();
        });
      } else if (data.choseSearch == "phone") {
        return data.items.map((value, index) => {
          return [value.phoneCustomer].join("").toLocaleLowerCase();
        });
      } else {
        return data.items.map((value, index) => {
          return [value.nameCustomer, value.emailCustomer, value.phoneCustomer]
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
      } else return data.items.value;
    });

    // handle print data
    const pdfContentRef = ref(null);
    const handlePrintReport = () => {
      const printContent = pdfContentRef.value;
      const originalContents = document.body.innerHTML;

      document.body.innerHTML = printContent.innerHTML;
      window.print();

      document.body.innerHTML = originalContents;
    };

    const isPrintReport = () => {
      return true;
    };

    const view = (item) => {
      data.viewValue = {
        Customer: {
          _id: item.Customer._id,
          name: item.Customer.name,
          birthday: formatDate(item.Customer.birthday),
          avatar: item.Customer.avatar,
          phone: item.Customer.phone,
          email: item.Customer.email ? item.Customer.email : "Chưa cập nhật",
          address: item.Customer.address,
          gender:
            item.Customer.gender == 0
              ? "Nam"
              : item.Customer.gender == 1
              ? "Nữ"
              : "Chưa cập nhật",
          note: item.Customer.note ? item.Customer.note : "Chưa cập nhật",
        },
        Customer_Type: {
          _id: item.Customer.Customer_Type._id,
          name: item.Customer.Customer_Type.name,
        },
        Company_KH: {
          _id: item.Company_KH._id,
          name: item.Company_KH.name,
        },
        Events: [...item.Customer.Events],
        Tasks: [...item.Customer.Tasks],
        Habits: {
          ...item.Customer.Habits,
        },
        _id: item._id,
        current_workplace: item.current_workplace,
        work_history: item.work_history,
        current_position: item.current_position,
        work_temp: item.work_temp,
      };

      data.viewCareCus = item.Customer.Tasks.map((value) => {
        return {
          start_date: formatDate(value.start_date),
          end_date: formatDate(value.end_date),
          content: value.content,
          customerName: item.Customer.name,
          cycleName: value.Cycle.name, // join bản sao
          statusName: value.Status_Task.name,
          EvaluateStar: value.Evaluate.star,
          comment:
            value.Comment == null ? "Chưa cập nhật" : value.Comment.content,
        };
      });

      data.Events = item.Customer.Events.map((item) => {
        return {
          name: item.name,
          time_duration: formatDateTime_2(item.time_duration),
          content: item.content,
          place: item.place != null ? item.place : "không có",
        };
      });
    };

    onBeforeMount(() => {
      reFresh();
    });

    return {
      data,
      setPages,
      handleUpdateEntryValue,
      handleUpdateSearchText,
      handlePrintReport,
      pdfContentRef,
      view,
      labels,
      store,
      // phân quyền
      isReadReport,
      isReadReportLeaderCustomer,
      isReadReportLeaderStaff,
      isReadReportCustomerCycle,
      isReadReportAssinmentStaff,
      isPrintReport,
      isMail,
      //
      startDateValue,
      endDateValue,
    };
  },
};
</script>

<style scoped>
.pdf-content {
  position: absolute;
  left: -9999px;
  top: -9999px;
}

.material-symbols-outlined {
  font-size: 18px;
}

.navbar {
  margin-top: -8px;
}

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

.report_container {
  display: flex;
  justify-content: space-between;
  margin: 10px 4px;
}

.mx-1.report__item {
  height: 75px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 18px;
}

a.none-active-menu,
a.router-link-active.router-link-exact-active.active-menu {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: start;
  padding: 5px;
  text-decoration: none;
}

a.router-link-active.router-link-exact-active.active-menu {
  font-weight: bold;
}

a.router-link-active.router-link-exact-active.active-menu
  span.material-symbols-outlined {
  color: blue;
}

span.material-symbols-outlined {
  padding: 5px;
  font-size: 24px;
  color: #000;
}
</style>
