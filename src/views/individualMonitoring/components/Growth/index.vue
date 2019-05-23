<template>
  <div class="container">
    <p class="head">生长属性</p>
    <table cellpadding="0" cellspacing="0" class="growth-attributes">
      <tbody>
        <tr v-for="(item,index) in growthIfo" :key="index">
          <td>{{item.name}}</td>
          <td>{{item.ifo}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
import info from "@/json/individualMonitoring/growth";
export default {
  data() {
    return {
      growthIfo: []
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.growthIfo = info.growthIfo;
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  padding: 0 2px;
  padding-top: 2px;
  .head {
    width: 100%;
    background: rgba(90, 86, 130, 1);
    box-shadow: 0px 0px 5px 0px rgba(2, 2, 2, 0.1);
    border-radius: 4px;
    height: 15px;
    line-height: 15px;
    text-align: left;
    text-align: center;
    margin: 0;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
  }
}
table {
  width: 100%;
  text-align: left;
  tbody {
    background: rgba(241, 241, 241, 1);
    box-shadow: 0px 0px 5px 0px rgba(2, 2, 2, 0.1);
    border-radius: 5px;
    tr:first-child td {
      padding-top: 10px;
      height: 30px;
      line-height: 10px;
    }
    tr:last-child td {
      padding-bottom: 10px;
      height: 30px;
      line-height: 10px;
    }
    td:first-child {
      color: #666666;
      padding-left: 20px;
      font-size: 12px;
    }
    td:last-child {
      height: 20px;
      font-size: 12px;
      color: #333333;
      font-weight: 200;
      padding-left: 20px;
      font-family: "微软雅黑";
    }
  }
}
@media (min-height: 800px) {
  .container {
    .head {
      height: 30px;
      line-height: 30px;
      font-size: 14px;
    }
    table {
      tbody {
        tr:first-child td {
          height: 40px;
        }
        tr:last-child td {
          height: 40px;
        }
        td:first-child {
          font-size: 14px;
          height: 23px;
        }
        td:last-child {
          height: 23px;
          font-size: 14px;
        }
      }
    }
  }
}
@media (min-height: 900px) {
  .container {
    .head {
      height: 30px;
      line-height: 30px;
      font-size: 16px;
    }
    table {
      tbody {
        tr:first-child td {
          height: 48px;
        }
        tr:last-child td {
          height: 48px;
        }
        td:first-child {
          font-size: 16px;
          height: 30px;
        }
        td:last-child {
          height: 30px;
          font-size: 16px;
        }
      }
    }
  }
}
@media (min-height: 1080px) {
  .container {
    .head {
      height: 40px;
      line-height: 30px;
      font-size: 18px;
    }
    table {
      tbody {
        tr:first-child td {
          height: 55px;
        }
        tr:last-child td {
          height: 55px;
        }
        td:first-child {
          font-size: 18px;
          height: 40px;
        }
        td:last-child {
          height: 40px;
          font-size: 18px;
        }
      }
    }
  }
}
</style>


