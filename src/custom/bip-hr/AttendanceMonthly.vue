<template>
  <div>
    <el-row style="padding: 5px 0px;">
      <el-button type="primary" icon="el-icon-search" size="mini" @click.native="select">查找</el-button>
      <el-button type="primary" icon="el-icon-files" size="mini" @click.native="exportDataEvent">导出</el-button>
    </el-row>
    <el-row class="bip-lay" >
      <el-form @submit.native.prevent label-position="right" label-width="100px">
        <div v-for="(cel,index) in tjCell.ccells.cels" :key="'A'+index" >
            <bip-comm-editor v-if="(cel.attr&0x400) <= 0 " :cell="cel" :bgrid="false" :cds="tjCell" :row="0" />
        </div> 
      </el-form>
    </el-row>
    <vxe-grid ref="ybTable" align="center" border stripe resizable height="550" :columns="tableColumn" :span-method="rowspanMethod" :data="tableData"></vxe-grid>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide, Watch } from "vue-property-decorator";
import { State, Action, Getter, Mutation } from "vuex-class";
import { User } from "@/classes/User";
import { Route, RawLocation } from "vue-router";
import CDataSet from "@/classes/pub/CDataSet";
import { Cells } from "@/classes/pub/coob/Cells";
import QueryEntity from "@/classes/search/QueryEntity";
import QueryCont from "@/classes/search/QueryCont";
import { BIPUtil } from "@/utils/Request";
let tools = BIPUtil.ServApi;
@Component({
  components: {

  }
})
export default class AttendanceMonthly extends Vue {
  @Provide() page: any = { pageSize: 2000, currPage: 1, total: 0 };
  @Provide() kq_state:any=null;
  @Provide() kq_ybstate:any = {};
  @Provide() tableColumn:any=[];
  @Provide() tableData:any=[];
  @Provide() tjCell:CDataSet= new CDataSet("");
  @Provide() span_id:any={sorg:"sorg"};//合并列id
  @Provide() yymm:any=null;
  @Provide() sopr:any=null;
  @Provide() sorg:any=null;
  async created() {
    this.tjCell = await this.getCell("KQ1020TJ");
    this.tjCell.createRecord();
    this.assemblyTableColumn();//组成表头
  } 
  async select(){
    this.sopr = this.tjCell.currRecord.data.sopr;
    this.sorg = this.tjCell.currRecord.data.sorg;
    this.yymm = this.tjCell.currRecord.data.yymm;
    let bok = this.checkNotNull(this.tjCell);
    if (!bok) return;
    this.assemblyTableColumn();//组成表头
    const loading = this.$loading({
      lock: true,
      text: '加载中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    }); 
    await this.getkqstate();
    await this.getkqybdetil();
    this.assemblyTableData();
    loading.close();
  }
  async getkqstate(){
    let qe:QueryEntity = new QueryEntity('','');
    qe.page.currPage = 1;
    qe.page.pageSize = 20000;
    qe.cont = "";

    let allCont = [];
    let oneCont = []; 
    //classes/search/QueryCont'; 有详细说明
    let qCont = new QueryCont('hpdate','2019-11-01',12);
    if(this.yymm){
      qCont = new QueryCont('hpdate1',this.yymm,12);
      qCont.setContrast(0);
      qCont.setLink(1);
      oneCont.push(qCont);
    }
    if(this.sopr){
      qCont = new QueryCont('sopr',this.sopr,12);
      qCont.setContrast(0);
      qCont.setLink(1);
      oneCont.push(qCont);
    }
    if(this.sorg){
      qCont = new QueryCont('sorg',this.sorg,12);
      qCont.setContrast(0);
      qCont.setLink(1);
      oneCont.push(qCont);
    }

    if(oneCont.length !=0){
      allCont.push(oneCont);
    qe.cont = "~" + JSON.stringify(allCont);
    }else{
      qe.cont = "";
    }
    let vv = await tools.getBipInsAidInfo('YBKQ_STATE',210,qe);
    if(vv.data.id ==0){
      this.kq_state = vv.data.data.data.values
    }
  } 
  async getkqybdetil(){
    let qe:QueryEntity = new QueryEntity('','');
    qe.page.currPage = 1;
    qe.page.pageSize = 20000;
    qe.cont = "";

    let allCont = [];
    let oneCont = []; 
    //classes/search/QueryCont'; 有详细说明
    let qCont = new QueryCont('yymm',this.yymm,12);
    if(this.yymm){
      let qCont = new QueryCont('yymm',this.yymm,12);
      qCont.setContrast(0);
      qCont.setLink(1);
      oneCont.push(qCont); 
    }
    if(this.sopr){
      qCont = new QueryCont('sopr',this.sopr,12);
      qCont.setContrast(0);
      qCont.setLink(1);
      oneCont.push(qCont);
    }
    if(this.sorg){
      qCont = new QueryCont('sorg',this.sorg,12);
      qCont.setContrast(0);
      qCont.setLink(1);
      oneCont.push(qCont);
    }
    if(oneCont.length !=0){
    allCont.push(oneCont);
    qe.cont = "~" + JSON.stringify(allCont);
    }else{
      qe.cont = "";
    }
    let vv = await tools.getBipInsAidInfo('YBKQ_DETIL',210,qe);
    if(vv.data.id ==0){
      let values = vv.data.data.data.values;
      for(var i=0;i<values.length;i++){
        this.kq_ybstate[values[i].sopr] = values[i];
      }
    }
  }
  //组成表头
  assemblyTableColumn(){
    if(this.yymm == null){
      this.yymm = (new Date().getFullYear()*100+new Date().getMonth()+1)+'';
    }
    let year = this.yymm.substring(0,4)
    let month = this.yymm.substring(4,this.yymm.length)
    this.tableColumn = [
      { type: 'index', width: 50, fixed:"left"},
      { field: 'sorg', title: '部门' ,width: 60 ,fixed:"left"},
      { field: 'name', title: '姓名' ,width: 60 ,fixed:"left"},
    ]
    var tempTime = new Date(year,month,0);
    var time = new Date();
    for(var i=1;i<=tempTime.getDate();i++){
      time.setFullYear(tempTime.getFullYear(),tempTime.getMonth(),i);
      var day = time.getDay();
      let week = "一";
      week = day ==0?"日":week;
      week = day ==1?"一":week;
      week = day ==2?"二":week;
      week = day ==3?"三":week;
      week = day ==4?"四":week;
      week = day ==5?"五":week;
      week = day ==6?"六":week;
      let column =  { title: i,
        children: [
          { field: 'day'+(i), title: week ,width: 60}
        ]
      }
      this.tableColumn.push(column);
    }
    let tableColumn1:any = [
      { field: 'shjoin', title: '应出勤数' ,width: 80},
      { field: 'acjoin', title: '实际出勤' ,width: 80},
      { field: 'sajoin', title: '周六加班' ,width: 80},
      { field: 'sujoin', title: '周天加班' ,width: 80},
      { field: 'hoday', title: '法定节假日',width: 100},
      { field: 'horest', title: '调休假' ,width: 80},
      { field: 'zc', title: '驻场' ,width: 50},
      { field: 'qj_bj', title: '病假' ,width: 50},
      { field: 'qj_sj', title: '事假' ,width: 50},
      { field: 'qj_cc', title: '出差' ,width: 50},
      { field: 'qj_kg', title: '旷工' ,width: 50},
      { field: 'qj_cd', title: '迟到' ,width: 50},
      { field: 'qj_nj', title: '年假' ,width: 50},
      { field: 'qj_hj', title: '婚假' ,width: 50},
      { field: 'qj_cj', title: '产假' ,width: 50},
      { field: 'qj_cjj', title: '产检假' ,width: 70},
      { field: 'qj_gs', title: '工伤' ,width: 50},
      { field: 'qj_sjj', title: '丧假' ,width: 50},
      { field: 'qj_tx', title: '调休' ,width: 50},
      // { field: 'qj_tqj', title: '探亲假' ,width: 70},
      // { field: 'qj_phj', title: '陪护假' ,width: 70},
      // { field: 'name', title: '备注' ,width: 50},
    ]
    this.tableColumn = this.tableColumn.concat(tableColumn1)
  }
  //组成table数据
  assemblyTableData(){
    this.tableData=[];
    let sopr = "";
    let name = "";
    let data:any={};
    for(var i=0;i<this.kq_state.length;i++){
      let v1 = this.kq_state[i];
      let hpdate = v1.hpdate;
      hpdate = hpdate.replace(/-/g,"/"); 
      hpdate = new Date(hpdate);
      let sopr1 = v1.sopr;
      let name1 = v1.name;
      if(sopr !="" && sopr !=sopr1){
        data["name"] = name;
        data= Object.assign(data,this.kq_ybstate[sopr]);
        this.tableData.push(data);
        data={};
      }
      data['day'+hpdate.getDate()] = v1.kq_ybstate;
      sopr = sopr1;
      name = name1;
      if(i == this.kq_state.length-1){
        data["name"] = v1.name;
        data= Object.assign(data,this.kq_ybstate[v1.sopr]);
        this.tableData.push(data);
      }
    }
  }
  //行合并
  rowspanMethod(row:any) {
    let $rowIndex = row.$rowIndex;
        let data = row.data;
        let column = row.column;
        if(this.span_id !=null){ 
            let prevRow = data[$rowIndex - 1]
            let nextRow = data[$rowIndex + 1]
            if (this.span_id[column.property]) {
                let cellValue = row.row[column.property];
                if (prevRow && prevRow[column.property] === cellValue) {
                    return {rowspan: 0,colspan: 0}
                }else{
                    let countRowspan = 1
                    while (nextRow && nextRow[column.property] === cellValue) {
                        nextRow = data[++countRowspan + $rowIndex]
                    }
                    if (countRowspan > 1) {
                        return { rowspan: countRowspan, colspan: 1 }
                    }
                }
            }
        }
  }
  //导出数据
  exportDataEvent(){
    let tb:any = this.$refs.ybTable;
    if(tb){
      tb.exportData({
          filename: '考勤月报',
          data: this.tableData
        })
    }
  }
  async getCell(cellid:string){
    let res = await tools.getCCellsParams(cellid); 
    let rtn: any = res.data; 
    if (rtn.id == 0) {
      let kn: Array<Cells> = rtn.data.layCels;
      let cells = kn; 
      return new CDataSet(cells[0]);  
    }else{
      return new CDataSet('');
    }
  }
  checkNotNull(cds: CDataSet): boolean {
    let bok = true;
    cds.ccells.cels.forEach(item => {
      if (item.unNull && bok) {
        let vl = null;
        let hide: any = [];
        if (cds.currRecord.data[item.id] != null)
          vl = cds.currRecord.data[item.id] + "";
        if (!vl && hide.indexOf(item.id) == -1) {
          this.$notify.warning("【" + item.labelString + "】不能为空!");
          bok = false;
          return false;
        }
      }
    });
    return bok;
  }
}
</script>
<style  lang="scss" >

</style>