// src/api/tahun-ajaran/content-types/tahun-ajaran/lifecycles.ts
export default {
  beforeCreate(event) {
    const { data } = event.params as { data: any };
    if (data.tahunAjaran && data.semester) {
      data.label = `${data.tahunAjaran} - ${data.semester}`;
    }
  },
  beforeUpdate(event) {
    const { data } = event.params as { data: any };
    if (data.tahunAjaran && data.semester) {
      data.label = `${data.tahunAjaran} - ${data.semester}`;
    }
  },
};
