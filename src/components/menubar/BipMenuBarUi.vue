<template>
    <el-row class="menubar">
        <el-button-group v-if="mbs">
            <template  v-for="(btn,index) in mbs.menuList">
                <el-button :key="index" v-if="btn.dlgType == '' || showDlg" :size="btn.size" @click.native="invokecmd(btn)" :disabled="!btn.enable">     
                    <template v-if="btn.hasIcon">
                        <template v-if="btn.icon&&btn.bIconleft">
                            <i :class="btn.icon"></i>{{btn.name}}
                        </template>    
                        <template v-else>
                            {{btn.name}} <i :class="btn.icon"></i> 
                        </template>
                    </template>
                    <template v-else>
                        {{btn.name}}
                    </template>
                </el-button>
            </template>
        </el-button-group>
    </el-row>

</template>
<script lang="ts">
//压缩;浏览;查询;缓存;5:增加;删除;保存;非定位;审核;
//10:审批;关联;文件;图形;引用;15:功能文字;统计;外部SQL;展开;批量打印;
//20:全部打印;邮件;无表格线;行单元底线;行单元边框;25:普通表头;关闭速查;执行可改
import { Component, Vue, Provide, Prop, Watch } from "vue-property-decorator";
import { State, Action, Getter, Mutation } from 'vuex-class';
import { CommICL } from "@/utils/CommICL";
import BipMenuBar from '@/classes/pub/BipMenuBar';
import CDataSet from '@/classes/pub/CDataSet';
@Component({})
export default class BipMenuBarUI extends Vue{
    @Prop() mbs!:BipMenuBar;
    @Prop() cds!:CDataSet
    @Provide() bInsert:boolean = true;
    @Provide() showDlg:boolean = true;
    invokecmd(btn:any){
        console.log(btn)
        this.$emit('invokecmd',btn);
    }
    mounted(){ 
        
    }
    beforeDestroy(){
        
    }
    ReportTableShape(){
        this.showDlg = !this.showDlg;
    }
}
</script>

