<template>
  <div class="container">
    <p class="head">基本属性</p>
    <table cellpadding="0" cellspacing="0" class="basic-attributes">
      <tbody>
        <tr v-for="(item,index) in baseList" :key="index">
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
import info from "@/json/individualMonitoring/basic";
export default {
  name: "Basic",
  props: {
    baseList: {
      type: Array,
      default: false
    }
  },
  data() {
    return {
      baseIfo: []
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  created() {
    this.getList();
  },
  methods: {
    //加载数据
    getList() {
      this.baseIfo = info.baseIfo;
    }
  }
};
</script>

<style lang="scss"  scoped>
.container {
  padding: 0 2px;
  padding-top: 2px;
}
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
.basic-attributes {
  width: 100%;
  height: 10%;
  text-align: left;
  tbody {
    background: rgba(241, 241, 241, 1);
    box-shadow: 0px 0px 5px 0px rgba(2, 2, 2, 0.1);
    tr:first-child td {
      padding-top: 10px;
      height: 25px;
    }
    tr:last-child td {
      padding-bottom: 10px;
      height: 25px;
    }
    td:first-child {
      font-size: 12px;
      height: 20px;
      color: #666666;
      padding-left: 20px;
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
  .head {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
  }
  .basic-attributes {
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
@media (min-height: 900px) {
  .head {
    height: 30px;
    line-height: 30px;
    font-size: 16px;
  }
  .basic-attributes {
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
@media (min-height: 1080px) {
  .head {
    height: 40px;
    line-height: 30px;
    font-size: 18px;
  }
  .basic-attributes {
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
</style>
<style>
table tr:first-child td:first-child,
table tr:first-child th:first-child {
  border-top-left-radius: 4px;
}
table tr:first-child td:last-child,
table tr:first-child th:last-child {
  border-top-right-radius: 4px;
}
table tr:last-child td:first-child {
  border-bottom-left-radius: 4px;
}
table tr:last-child td:last-child {
  border-bottom-right-radius: 4px;
}
</style>




