import createApiClient from "./api.service";

class EventService {
  constructor(baseUrl = "/api/task_employees/") {
    this.api = createApiClient(baseUrl);
  }
  async getAll() {
    return (await this.api.get("/")).data;
  }
  async create(data) {
    return (await this.api.post("/", data)).data;
  }
  async deleteOne(data) {
    return (await this.api.post(`/del`, data)).data;
  }
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }
}

export default new EventService();
