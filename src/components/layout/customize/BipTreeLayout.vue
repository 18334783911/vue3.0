<template>
  <div style="padding-right:10px;background-color: #e8e8e8;hegiht:100%">
    <el-tree :node-key="keyID" lazy :load="loadNode" @node-click="handleNodeClick"
      :props="defaultProps" :default-expanded-keys="expandedKeys" >
    </el-tree>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide, Prop, Watch } from "vue-property-decorator"
import { BipLayout } from '@/classes/ui/BipLayout';
import BipLayConf from '@/classes/ui/BipLayConf';
import CCliEnv from '@/classes/cenv/CCliEnv'
import CDataSet from '@/classes/pub/CDataSet';
import BipLayCells from '@/classes/ui/BipLayCells';
import QueryEntity from '@/classes/search/QueryEntity';
@Component({
    components:{}
})
export default class BipTreeLayout extends Vue{
    @Prop() env?:CCliEnv
    @Prop() config?:any
    @Prop() laycell!:BipLayCells 
    @Provide() comps:Array<BipLayConf> = []
    @Provide() data:Array<any> = [];
    @Provide() defaultProps:any ={};
    @Provide() cds:CDataSet = new CDataSet(null)
    @Provide() fatherID = '';
    @Provide() keyID = '';
    @Provide() expandedKeys:any = [];
    @Provide() expandedLevel = -1;
    mounted(){
       
    }
    created(){
      if(this.env){
        this.cds = this.env.getDataSet(this.laycell.cells.obj_id);
        this.cds.cont = this.env.uriParams.pdata;
        let utree = this.env.uriParams.pbds.CTREE;
        if(utree){
          utree = utree.split(",")
          this.keyID = utree[0];
          this.defaultProps = {
            children: utree[0],
            label: utree[1]
          }
          this.fatherID = utree[2];
          if(utree.length>3)
            this.expandedLevel = utree[3]
        }
      }
    }

    async loadNode(node:any, resolve:any) {
      let cont = "";
      if (node.level === 0) {
        cont = this.fatherID+" is null "
      } else {
          let v = node.data[this.keyID]
          cont = " "+this.fatherID+" = '"+v+"' ";
      }
      let data:any = await this.initTree(cont)
      if(data){
        if(!Array.isArray(data)){
          data = [data]; 
        }
        if(this.expandedLevel>0 && (node.level+1)<=this.expandedLevel){
          for(var i=0;i<data.length;i++){
            let cc:any = data[i]
            this.expandedKeys.push(cc[this.keyID]);
          }
        }
        resolve(data);
      }else{
        resolve([]); 
      }
    }
    async initTree(vl:any){
      let obj_id = this.cds.ccells.obj_id;
      let cont = vl;
      let qe:QueryEntity = new QueryEntity(obj_id,obj_id,cont);
      qe.oprid = 14
      qe.page.pageSize=1000
      let vv = await this.cds.queryData(qe);
      if(vv.data.id ==0){
        let value = vv.data.data.data.data;
        let retVl = [];
        for(var i=0;i<value.length;i++){
          retVl.push(value[i].data);
        }
        return retVl;
      }else{
        return null;
      }
    }
    handleNodeClick(data:any,data1:any,data2:any) {
      console.log(data);
      console.log(data1);
      console.log(data2);
    }
}
</script>
