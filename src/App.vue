<template>
  <el-container id="app">
    <el-main class="main-container">
      <el-steps
        :active="active"
        finish-status="success"
      >
        <el-step title="选择文件夹"></el-step>
        <el-step title="生成排序配置"></el-step>
        <el-step title="生成脚本"></el-step>
      </el-steps>
      <!-- 步骤显示 -->
      <div
        class="main"
        v-loading="active === 1"
      >
        <!-- 打开文件夹 -->
        <div v-if="active === 0">
          <el-button
            @click="openDir"
            type="danger"
          >打开任务文件夹</el-button>
          <div style="color: #aaaaaa;margin-top: 8px;">文件夹内应该包含本次任务的 摊位文件夹</div>
        </div>
        <PagePreview
          :pageGroups="pageGroups"
          v-if="active === 2"
        />
      </div>
    </el-main>
    <el-aside class="options">
      <h2>脚本配置</h2>
      <el-form
        :model="scriptOptions"
        label-position="left"
        label-width="100px"
        size="mini"
      >
        <el-form-item label="容器名">
          <el-input v-model="scriptOptions.containerName"></el-input>
        </el-form-item>
        <el-form-item label="自动导入图片">
          <el-checkbox v-model="scriptOptions.photo"></el-checkbox>
        </el-form-item>
      </el-form>
      <el-button
        :disabled="active !== 2"
        @click="saveDir"
        type="primary"
      >生成脚本</el-button>
    </el-aside>
  </el-container>
</template>

<script>
import { ipcRenderer } from 'electron'
import getDayTaskMeta from './helper/meta'
import outputDayTask from './helper/generate'
import PagePreview from './components/PagePreview.vue'

export default {
  name: 'App',
  components: {
    PagePreview
  },
  data () {
    return {
      scriptOptions: {
        containerName: '组1',
        photo: true
      },
      active: 2, // 0 未开始，1进行中，2预览可生成
      pageGroups: [[[{ path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V57V58)[虚拟人形工程部]肝脏报废小金街/雪地夜话(262894)+[小说]{15}[2021-05-23].png', name: '雪地夜话', stallName: '肝脏报废小金街', type: 'png', groupId: 'V57-58' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V59)[魔女咖啡馆]伊修加德复兴委员会/【光＆于】微光(311176)+[小说]{5}[2021-05-29].jpeg', name: '【光＆于】微光', stallName: '伊修加德复兴委员会', type: 'jpeg', groupId: 'V59' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V60)[龙男贴贴打折]龙男贴贴打折/摸鱼本(304221)+[漫画]{2}[2021-04-10].png', name: '摸鱼本', stallName: '龙男贴贴打折', type: 'png', groupId: 'V60' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V60)[龙男贴贴打折]龙男贴贴打折/禁止摸鱼本(308274)+[漫画]{1}[2021-04-23].png', name: '禁止摸鱼本', stallName: '龙男贴贴打折', type: 'png', groupId: 'V60' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V60)[龙男贴贴打折]龙男贴贴打折/莫莫拉莫拉的工厂历险记(299428)+[漫画]{7}[2021-04-03].png', name: '莫莫拉莫拉的工厂历险记', stallName: '龙男贴贴打折', type: 'png', groupId: 'V60' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V62)[绝亚摸鱼小分队]绝亚摸鱼小分队/【光all】男子大学生会遇见幻想主义水晶吗(248773)+[小说]{21}[2021-05-16].png', name: '【光all】男子大学生会遇见幻想主义水晶吗', stallName: '绝亚摸鱼小分队', type: 'png', groupId: 'V62' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V62)[绝亚摸鱼小分队]绝亚摸鱼小分队/【古代三人组】当我抄哈迪斯毕设的时候我在想什(248768)+[小说]{22}[2021-05-13].png', name: '【古代三人组】当我抄哈迪斯毕设的时候我在想什', stallName: '绝亚摸鱼小分队', type: 'png', groupId: 'V62' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V62)[绝亚摸鱼小分队]绝亚摸鱼小分队/古拉哈x光x公  《左右为难》(291193)+[小说]{10}[2021-05-08].png', name: '古拉哈x光x公  《左右为难》', stallName: '绝亚摸鱼小分队', type: 'png', groupId: 'V62' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V62)[绝亚摸鱼小分队]绝亚摸鱼小分队/皇都伊修加德学院男公关部(291196)+[小说]{5}[2021-05-05].png', name: '皇都伊修加德学院男公关部', stallName: '绝亚摸鱼小分队', type: 'png', groupId: 'V62' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V63)[奶茶加冰不加糖]苦夏奶茶店/Dk伏黑惠(291658)+[综合]{28}[2021-04-20].png', name: 'Dk伏黑惠', stallName: '苦夏奶茶店', type: 'png', groupId: 'V63' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V63)[奶茶加冰不加糖]苦夏奶茶店/五夏五-璀璨如歌(303255)+[图集]{24}[2021-04-08].png', name: '五夏五-璀璨如歌', stallName: '苦夏奶茶店', type: 'png', groupId: 'V63' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V63)[奶茶加冰不加糖]苦夏奶茶店/咒回 两面宿傩(292975)+[综合]{29}[2021-04-20].png', name: '咒回 两面宿傩', stallName: '苦夏奶茶店', type: 'png', groupId: 'V63' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V63)[奶茶加冰不加糖]苦夏奶茶店/咒回 虎杖悠仁(292221)+[综合]{35}[2021-04-20].png', name: '咒回 虎杖悠仁', stallName: '苦夏奶茶店', type: 'png', groupId: 'V63' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V63)[奶茶加冰不加糖]苦夏奶茶店/咒回狗卷棘(290868)+[综合]{30}[2021-04-20].png', name: '咒回狗卷棘', stallName: '苦夏奶茶店', type: 'png', groupId: 'V63' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V63)[奶茶加冰不加糖]苦夏奶茶店/咒术-五条悟(291659)+[综合]{35}[2021-04-20].png', name: '咒术-五条悟', stallName: '苦夏奶茶店', type: 'png', groupId: 'V63' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V63)[奶茶加冰不加糖]苦夏奶茶店/咒术回战赛博朋克五条悟(280849)+[综合]{63}[2021-03-12].png', name: '咒术回战赛博朋克五条悟', stallName: '苦夏奶茶店', type: 'png', groupId: 'V63' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V64)[干饭了！干饭了！]五条猫猫教会/五条猫猫教——全世界的男人都爱我(288067)+[小说]{2}[2021-03-11].png', name: '五条猫猫教——全世界的男人都爱我', stallName: '五条猫猫教会', type: 'png', groupId: 'V64' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V64)[干饭了！干饭了！]五条猫猫教会/如何庇护神明(252235)+[小说]{78}[2021-05-29].png', name: '如何庇护神明', stallName: '五条猫猫教会', type: 'png', groupId: 'V64' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V65)[新用户c4836的社团]流浪猫咪收容所/五夏本《辗转纪年》(279799)+[小说]{68}[2021-05-04].png', name: '五夏本《辗转纪年》', stallName: '流浪猫咪收容所', type: 'png', groupId: 'V65' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V66)[妈咪！饭饭！]幼稚园yeogiyeogi/蠟筆五伏(281764)+[漫画]{34}[2021-03-14].png', name: '蠟筆五伏', stallName: '幼稚园yeogiyeogi', type: 'png', groupId: 'V66' }], [{ path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V67)[杂食人的饭堂]杂食人的饭堂/【夏五夏】东京都立咒术高等专门学校处分记录本(296039)+[漫画]{485}[2021-05-29].png', name: '【夏五夏】东京都立咒术高等专门学校处分记录本', stallName: '杂食人的饭堂', type: 'png', groupId: 'V67' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V68)[新用户0410a的社团]明媚晦涩的三年/五夏五-他心通(303208)+[小说]{34}[2021-04-10].png', name: '五夏五-他心通', stallName: '明媚晦涩的三年', type: 'png', groupId: 'V68' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V68)[新用户0410a的社团]明媚晦涩的三年/诡秘之主-阿蒙(302831)+[综合]{39}[2021-05-13].png', name: '诡秘之主-阿蒙', stallName: '明媚晦涩的三年', type: 'png', groupId: 'V68' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V69-70)[你比四条多一条]半夜偷看三年青春小电影/aying omething(286386)+[漫画]{329}[2021-05-03].png', name: 'aying omething', stallName: '半夜偷看三年青春小电影', type: 'png', groupId: 'V69-70' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V69-70)[你比四条多一条]半夜偷看三年青春小电影/bye-bye my baby blue(276988)+[漫画]{512}[2021-03-09].jpeg', name: 'bye-bye my baby blue', stallName: '半夜偷看三年青春小电影', type: 'jpeg', groupId: 'V69-70' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V69-70)[你比四条多一条]半夜偷看三年青春小电影/《Beautiful World》(311603)+[小说]{60}[2021-05-30].png', name: '《Beautiful World》', stallName: '半夜偷看三年青春小电影', type: 'png', groupId: 'V69-70' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V69-70)[你比四条多一条]半夜偷看三年青春小电影/【五夏五无差】墙(280119)+[小说]{65}[2021-03-08].png', name: '【五夏五无差】墙', stallName: '半夜偷看三年青春小电影', type: 'png', groupId: 'V69-70' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V69-70)[你比四条多一条]半夜偷看三年青春小电影/猫猫能有什么坏心眼(312961)+[小说]{40}[2021-05-12].png', name: '猫猫能有什么坏心眼', stallName: '半夜偷看三年青春小电影', type: 'png', groupId: 'V69-70' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V71)[印量不多]印量不多墙很大/咒术回战虎杖悠仁中心本(291413)+[漫画]{205}[2021-05-11].png', name: '咒术回战虎杖悠仁中心本', stallName: '印量不多墙很大', type: 'png', groupId: 'V71' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V72)[DONSKY]两面宿傩在东北烤冷面/五夏 单相思(293099)+[小说]{5}[2021-03-20].png', name: '五夏 单相思', stallName: '两面宿傩在东北烤冷面', type: 'png', groupId: 'V72' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V73)[家入硝子医务室]/过期年历(284719)+[图集]{2}[2021-03-07].png', name: '过期年历', stallName: '家入硝子医务室', type: 'png', groupId: 'V73' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V76)[我们俩不会道别]他们不会分离/ex education and イチゴケーキ(286294)+[小说]{47}[2021-04-04].png', name: 'ex education and イチゴケーキ', stallName: '他们不会分离', type: 'png', groupId: 'V76' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V76)[我们俩不会道别]他们不会分离/“夏時雨に傘を ”_五条悟个人et_“夏時雨に傘を ”五条悟个人et(315327)+[综合]{50}[2021-05-18].png', name: '“夏時雨に傘を ”_五条悟个人et_“夏時雨に傘を ”五条悟个人et', stallName: '他们不会分离', type: 'png', groupId: 'V76' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V76)[我们俩不会道别]他们不会分离/夏五《叛逃》(281247)+[小说]{43}[2021-03-06].png', name: '夏五《叛逃》', stallName: '他们不会分离', type: 'png', groupId: 'V76' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V77-78)[神奇生物咒术高专交流所]神奇生物咒术高专交流所/《春风化雨》敬蝎敬(308160)+[小说]{22}[2021-04-23].png', name: '《春风化雨》敬蝎敬', stallName: '神奇生物咒术高专交流所', type: 'png', groupId: 'V77-78' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V77-78)[神奇生物咒术高专交流所]神奇生物咒术高专交流所/《梦中红烛夜听雨》敬蝎敬(307881)+[小说]{25}[2021-04-21].png', name: '《梦中红烛夜听雨》敬蝎敬', stallName: '神奇生物咒术高专交流所', type: 'png', groupId: 'V77-78' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V77-78)[神奇生物咒术高专交流所]神奇生物咒术高专交流所/【cp28首发】《交换》咒术回战校园棒球AU(282011)+[小说]{46}[2021-04-20].png', name: '【cp28首发】《交换》咒术回战校园棒球AU', stallName: '神奇生物咒术高专交流所', type: 'png', groupId: 'V77-78' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V79)[白猫煮虾仁]/《仁花日记》(282084)+[漫画]{605}[2021-05-25].png', name: '《仁花日记》', stallName: '白猫煮虾仁', type: 'png', groupId: 'V79' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V79)[白猫煮虾仁]/【排球少年】《动物排友会》漫画本(253947)+[漫画]{677}[2021-05-05].png', name: '【排球少年】《动物排友会》漫画本', stallName: '白猫煮虾仁', type: 'png', groupId: 'V79' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V80)[宇宙人刺身]宇宙人刺身/咒术回战五条悟中心插图个人志(304709)+[图集]{15}[2021-04-12].png', name: '咒术回战五条悟中心插图个人志', stallName: '宇宙人刺身', type: 'png', groupId: 'V80' }]], [[{ path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V81)[龙潭海市]南极洲地皮开发商/【伏虎】落雷(305807)+[综合]{15}[2021-04-13].png', name: '【伏虎】落雷', stallName: '南极洲地皮开发商', type: 'png', groupId: 'V81' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V81)[龙潭海市]南极洲地皮开发商/原创OC(286954)+[图集]{1}[2021-03-10].png', name: '原创OC', stallName: '南极洲地皮开发商', type: 'png', groupId: 'V81' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V81)[龙潭海市]南极洲地皮开发商/咒回一年级组摸鱼本(286752)+[图集]{6}[2021-04-20].png', name: '咒回一年级组摸鱼本', stallName: '南极洲地皮开发商', type: 'png', groupId: 'V81' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V81)[龙潭海市]南极洲地皮开发商/海伊中心向画册(286847)+[图集]{3}[2021-03-09].png', name: '海伊中心向画册', stallName: '南极洲地皮开发商', type: 'png', groupId: 'V81' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V83)[注意卫生]海胆一顿仨卷心菜/【伏虎个志】海上火(299827)+[小说]{48}[2021-04-15].jpeg', name: '【伏虎个志】海上火', stallName: '海胆一顿仨卷心菜', type: 'jpeg', groupId: 'V83' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V84)[拖延症患者治疗中心]惠蔷恋爱观察室/伏钉 黑白漫画《东京恋爱指南》(287888)+[漫画]{43}[2021-04-10].png', name: '伏钉 黑白漫画《东京恋爱指南》', stallName: '惠蔷恋爱观察室', type: 'png', groupId: 'V84' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V85)[小趴制造]托业不考九百不改名/【乙棘】乙骨博士的研发笔记(292526)+[小说]{38}[2021-05-28].png', name: '【乙棘】乙骨博士的研发笔记', stallName: '托业不考九百不改名', type: 'png', groupId: 'V85' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V85)[小趴制造]托业不考九百不改名/【乙棘】于圣殿中(318746)+[小说]{27}[2021-05-31].png', name: '【乙棘】于圣殿中', stallName: '托业不考九百不改名', type: 'png', groupId: 'V85' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V85)[小趴制造]托业不考九百不改名/【惠加茂】皿(284722)+[小说]{12}[2021-05-31].png', name: '【惠加茂】皿', stallName: '托业不考九百不改名', type: 'png', groupId: 'V85' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V85)[小趴制造]托业不考九百不改名/咒术回战伏虎同人本【归】(308654)+[漫画]{11}[2021-04-25].png', name: '咒术回战伏虎同人本【归】', stallName: '托业不考九百不改名', type: 'png', groupId: 'V85' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V86)[代餐高手]好儿子就要干爸爸/my guiding tar(296079)+[小说]{1}[2021-03-25].png', name: 'my guiding tar', stallName: '好儿子就要干爸爸', type: 'png', groupId: 'V86' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V88)[海豹极地乐园的社团]伏黑惠是1/《木漏れ日》伏虎小说(285709)+[小说]{13}[2021-03-08].png', name: '《木漏れ日》伏虎小说', stallName: '伏黑惠是1', type: 'png', groupId: 'V88' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V88)[海豹极地乐园的社团]伏黑惠是1/伏虎漫画-《恋爱是个好东西》（黑白）(306734)+[漫画]{114}[2021-05-30].png', name: '伏虎漫画-《恋爱是个好东西》（黑白）', stallName: '伏黑惠是1', type: 'png', groupId: 'V88' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V88)[海豹极地乐园的社团]伏黑惠是1/伏虎漫画-《苦味果酱》（全彩）(306727)+[漫画]{108}[2021-05-30].png', name: '伏虎漫画-《苦味果酱》（全彩）', stallName: '伏黑惠是1', type: 'png', groupId: 'V88' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V89)[惠左路边摊炒饭老板]惠左炒冷饭路边摊/伏宿-蜜桃派(283024)+[小说]{19}[2021-05-05].png', name: '伏宿-蜜桃派', stallName: '惠左炒冷饭路边摊', type: 'png', groupId: 'V89' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V89)[惠左路边摊炒饭老板]惠左炒冷饭路边摊/伏虎-Night Rule(282925)+[小说]{47}[2021-04-08].png', name: '伏虎-Night Rule', stallName: '惠左炒冷饭路边摊', type: 'png', groupId: 'V89' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V90)[惠左制品发射基地]为私情的诞生献上礼炮/伏虎插图合志《归》(306903)+[图集]{10}[2021-04-17].png', name: '伏虎插图合志《归》', stallName: '为私情的诞生献上礼炮', type: 'png', groupId: 'V90' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V90)[惠左制品发射基地]为私情的诞生献上礼炮/死生复相见(282846)+[小说]{47}[2021-04-14].png', name: '死生复相见', stallName: '为私情的诞生献上礼炮', type: 'png', groupId: 'V90' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V91)[光之摸鱼人]光之鸽子在天穹街/奥尔光 归来之人(252998)+[小说]{4}[2021-05-30].png', name: '奥尔光 归来之人', stallName: '光之鸽子在天穹街', type: 'png', groupId: 'V91' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V94)[雪都正副总长催婚协会]平平无奇的萨雷安魔法大学/Reflection·镜面倒影(279725)+[小说]{22}[2021-05-24].png', name: 'Reflection·镜面倒影', stallName: '平平无奇的萨雷安魔法大学', type: 'png', groupId: 'V94' }], [{ path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V94)[雪都正副总长催婚协会]平平无奇的萨雷安魔法大学/平平无奇的 萨雷安魔法大学 研究生混合宿舍(279726)+[小说]{42}[2021-05-18].png', name: '平平无奇的 萨雷安魔法大学 研究生混合宿舍', stallName: '平平无奇的萨雷安魔法大学', type: 'png', groupId: 'V94' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V95)[亚拉戈三文鱼HQ]亚拉戈三文鱼HQ/FF14花嫁主题同人画集(294953)+[图集]{60}[2021-04-21].png', name: 'FF14花嫁主题同人画集', stallName: '亚拉戈三文鱼HQ', type: 'png', groupId: 'V95' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V97)[小心黑白魔]小心黑白魔/[FF14]黑白魔文本《再会于雨中（下）》(299659)+[小说]{15}[2021-05-31].png', name: '[FF14]黑白魔文本《再会于雨中（下）》', stallName: '小心黑白魔', type: 'png', groupId: 'V97' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V97)[小心黑白魔]小心黑白魔/魇-死去的蝴蝶与两朵玫瑰(288062)+[漫画]{30}[2021-04-29].png', name: '魇-死去的蝴蝶与两朵玫瑰', stallName: '小心黑白魔', type: 'png', groupId: 'V97' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V98)[早安！尘封密岩]失物招领处/最终幻想14同人志《失物招领处》(295408)+[漫画]{13}[2021-03-24].jpeg', name: '最终幻想14同人志《失物招领处》', stallName: '失物招领处', type: 'jpeg', groupId: 'V98' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V101)[快乐爬墙人协会]公式光是猛1协会/光之战士增殖中(261729)+[漫画]{5}[2021-03-17].png', name: '光之战士增殖中', stallName: '公式光是猛1协会', type: 'png', groupId: 'V101' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V104)[三颗智齿]我的龙男必穿jk/【最终幻想14】《致野兽们》(300810)+[小说]{18}[2021-04-04].png', name: '【最终幻想14】《致野兽们》', stallName: '我的龙男必穿jk', type: 'png', groupId: 'V104' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V104)[三颗智齿]我的龙男必穿jk/【最终幻想14】宝石兽同人(320101)+[综合]{20}[2021-05-31].png', name: '【最终幻想14】宝石兽同人', stallName: '我的龙男必穿jk', type: 'png', groupId: 'V104' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V105)[干了这碗孟婆汤]芳香蝾螈养殖场/纷争不上前线(298089)+[漫画]{17}[2021-03-29].png', name: '纷争不上前线', stallName: '芳香蝾螈养殖场', type: 'png', groupId: 'V105' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V106V107)[兴趣使然的民工团]莫莫拉莫拉一块钱30斤/FF14古拉哈提亚无cp合志~REunion(295988)+[图集]{21}[2021-05-23].png', name: 'FF14古拉哈提亚无cp合志~REunion', stallName: '莫莫拉莫拉一块钱30斤', type: 'png', groupId: 'V106-107' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V106V107)[兴趣使然的民工团]莫莫拉莫拉一块钱30斤/【FF14】秦福瓦兰 Gearney(295995)+[小说]{32}[2021-05-28].png', name: '【FF14】秦福瓦兰 Gearney', stallName: '莫莫拉莫拉一块钱30斤', type: 'png', groupId: 'V106-107' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V110)[不鸽工作室]鸽子大澡堂/尼尔同人文本《唯乐芯片》(290796)+[小说]{20}[2021-05-31].png', name: '尼尔同人文本《唯乐芯片》', stallName: '鸽子大澡堂', type: 'png', groupId: 'V110' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V110)[不鸽工作室]鸽子大澡堂/盗墓笔记瓶邪同人文本《沉冰》(281462)+[小说]{64}[2021-05-28].png', name: '盗墓笔记瓶邪同人文本《沉冰》', stallName: '鸽子大澡堂', type: 'png', groupId: 'V110' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V112)[创伤小组]夜之城刀片批发市场/愚人与红鸟(288286)+[漫画]{34}[2021-05-10].png', name: '愚人与红鸟', stallName: '夜之城刀片批发市场', type: 'png', groupId: 'V112' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V113)[船坞数据中枢库]Relic故障区/晚安杰克 杰克个人本(304969)+[图集]{12}[2021-04-12].jpeg', name: '晚安杰克 杰克个人本', stallName: 'Relic故障区', type: 'jpeg', groupId: 'V113' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V114)[新用户fa317的社团]荒坂relic批发市场/赛博朋克2077小田三太夫图集(304717)+[图集]{2}[2021-04-12].jpeg', name: '赛博朋克2077小田三太夫图集', stallName: '荒坂relic批发市场', type: 'jpeg', groupId: 'V114' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V114)[新用户fa317的社团]荒坂relic批发市场/赛博朋克2077竹v同人志(305344)+[小说]{20}[2021-04-13].jpeg', name: '赛博朋克2077竹v同人志', stallName: '荒坂relic批发市场', type: 'jpeg', groupId: 'V114' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V114)[新用户fa317的社团]荒坂relic批发市场/赛博朋克2077竹村五郎个人图集(304724)+[图集]{6}[2021-04-12].jpeg', name: '赛博朋克2077竹村五郎个人图集', stallName: '荒坂relic批发市场', type: 'jpeg', groupId: 'V114' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V115)[拉德里罗的私藏]拉德里罗先生的私藏/非常随意的图集（主2077部分ow、DMC5）(302244)+[图集]{24}[2021-04-20].png', name: '非常随意的图集（主2077部分ow、DMC5）', stallName: '拉德里罗先生的私藏', type: 'png', groupId: 'V115' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V116)[驼驼的抽屉]我在夜之城扫大街/《郁金香之犬》2077小田中心本【群内预定(299981)+[小说]{21}[2021-05-21].png', name: '《郁金香之犬》2077小田中心本【群内预定', stallName: '我在夜之城扫大街', type: 'png', groupId: 'V116' }]], [[{ path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V117)[来罐绿色凝胶吧]Samurai武侍/梦缠绕的时候(307548)+[漫画]{19}[2021-04-20].png', name: '梦缠绕的时候', stallName: 'Samurai武侍', type: 'png', groupId: 'V117' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V117)[来罐绿色凝胶吧]Samurai武侍/银v漫本—咔哒(294491)+[漫画]{23}[2021-04-19].jpeg', name: '银v漫本—咔哒', stallName: 'Samurai武侍', type: 'jpeg', groupId: 'V117' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V118)[冥王星开发办]马家屯精神卫生中心/【AC1】Letu al-Haqq我非真理(298538)+[综合]{9}[2021-05-27].png', name: '【AC1】Letu al-Haqq我非真理', stallName: '马家屯精神卫生中心', type: 'png', groupId: 'V118' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V119-120)[AIShaun工作室]摊主花了几千块来上海加班/你如何谈论希望，当……(298584)+[小说]{2}[2021-03-30].png', name: '你如何谈论希望，当……', stallName: '摊主花了几千块来上海加班', type: 'png', groupId: 'V119-120' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V121)[大概是没了]伊甸零式碎片金苹果神殿/在有他的城市中(304820)+[小说]{3}[2021-04-12].png', name: '在有他的城市中', stallName: '伊甸零式碎片金苹果神殿', type: 'png', groupId: 'V121' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V121)[大概是没了]伊甸零式碎片金苹果神殿/黎明之前(304848)+[小说]{9}[2021-04-12].png', name: '黎明之前', stallName: '伊甸零式碎片金苹果神殿', type: 'png', groupId: 'V121' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V122)[新用户7ab29的社团]土豆你害人不浅/刺客信条同人小说 往事(301568)+[小说]{14}[2021-04-29].jpeg', name: '刺客信条同人小说 往事', stallName: '土豆你害人不浅', type: 'jpeg', groupId: 'V122' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V126)[金金放养地球支部]金金放养地球支部/【all金】反派的女装生涯(295920)+[小说]{12}[2021-03-31].png', name: '【all金】反派的女装生涯', stallName: '金金放养地球支部', type: 'png', groupId: 'V126' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V127)[智慧树上智慧果]浑水摸鱼/玻璃球(297866)+[小说]{16}[2021-05-20].png', name: '玻璃球', stallName: '浑水摸鱼', type: 'png', groupId: 'V127' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V128)[团团团团]金最可爱/【All金】论金的各种食用方式by异百(296897)+[小说]{15}[2021-05-08].png', name: '【All金】论金的各种食用方式by异百', stallName: '金最可爱', type: 'png', groupId: 'V128' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V129)[不可思议未解之谜]最后的甜党为你而来/《逆转之镜》(281145)+[漫画]{18}[2021-03-19].png', name: '《逆转之镜》', stallName: '最后的甜党为你而来', type: 'png', groupId: 'V129' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V134)[猫狗团分部]猫猫今天揍狗了吗/【传承】(290040)+[图集]{8}[2021-03-15].jpeg', name: '【传承】', stallName: '猫猫今天揍狗了吗', type: 'jpeg', groupId: 'V134' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V134)[猫狗团分部]猫猫今天揍狗了吗/嘉德罗斯冬日偶像(298470)+[综合]{18}[2021-03-30].jpeg', name: '嘉德罗斯冬日偶像', stallName: '猫猫今天揍狗了吗', type: 'jpeg', groupId: 'V134' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V134)[猫狗团分部]猫猫今天揍狗了吗/嘉德罗斯冬日暖阳(298475)+[综合]{16}[2021-03-30].jpeg', name: '嘉德罗斯冬日暖阳', stallName: '猫猫今天揍狗了吗', type: 'jpeg', groupId: 'V134' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V134)[猫狗团分部]猫猫今天揍狗了吗/红绿灯与柴犬的适配性(301537)+[小说]{10}[2021-04-06].png', name: '红绿灯与柴犬的适配性', stallName: '猫猫今天揍狗了吗', type: 'png', groupId: 'V134' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V134)[猫狗团分部]猫猫今天揍狗了吗/运动pa嘉德罗斯-花样滑冰赛场(298473)+[综合]{9}[2021-03-30].jpeg', name: '运动pa嘉德罗斯-花样滑冰赛场', stallName: '猫猫今天揍狗了吗', type: 'jpeg', groupId: 'V134' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V137)[画岩-啥都有点]画岩-仇剑亭的杂事铺/伊秋【新春乐游】(297904)+[综合]{11}[2021-03-29].png', name: '伊秋【新春乐游】', stallName: '画岩-仇剑亭的杂事铺', type: 'png', groupId: 'V137' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V138)[没有咸蛋的超人]没有咸蛋的超人/ene of ecurity(284718)+[小说]{1}[2021-03-07].png', name: 'ene of ecurity', stallName: '没有咸蛋的超人', type: 'png', groupId: 'V138' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(V138)[没有咸蛋的超人]没有咸蛋的超人/千杯不醉(255046)+[小说]{24}[2021-03-07].png', name: '千杯不醉', stallName: '没有咸蛋的超人', type: 'png', groupId: 'V138' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(W01)[不靠谱杂货铺]不靠谱杂货铺/《神圣亵渎》安金文漫本(318372)+[小说]{15}[2021-05-27].png', name: '《神圣亵渎》安金文漫本', stallName: '不靠谱杂货铺', type: 'png', groupId: 'W01' }], [{ path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(W01)[不靠谱杂货铺]不靠谱杂货铺/《虔诚之花》安金小画册(318371)+[图集]{18}[2021-05-27].png', name: '《虔诚之花》安金小画册', stallName: '不靠谱杂货铺', type: 'png', groupId: 'W01' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(W01)[不靠谱杂货铺]不靠谱杂货铺/《蝉蜕玉》夏五(318357)+[小说]{17}[2021-05-27].png', name: '《蝉蜕玉》夏五', stallName: '不靠谱杂货铺', type: 'png', groupId: 'W01' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(W02)[白夜永生]白夜永生/《厄洛斯的馈赠》雷安·潘多拉企划(316541)+[小说]{57}[2021-05-27].png', name: '《厄洛斯的馈赠》雷安·潘多拉企划', stallName: '白夜永生', type: 'png', groupId: 'W02' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(W03)[不知花]雷狮安迷修喵喵叫/阴阳怪气 肥啾paro(294250)+[综合]{59}[2021-04-05].jpeg', name: '阴阳怪气 肥啾paro', stallName: '雷狮安迷修喵喵叫', type: 'jpeg', groupId: 'W03' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(W03)[不知花]雷狮安迷修喵喵叫/阴阳怪气 茶会paro(294254)+[综合]{38}[2021-03-22].jpeg', name: '阴阳怪气 茶会paro', stallName: '雷狮安迷修喵喵叫', type: 'jpeg', groupId: 'W03' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(W04)[狗狗队今天要打工]狗头兄弟社/Drum Go Dum(311682)+[小说]{50}[2021-05-31].jpeg', name: 'Drum Go Dum', stallName: '狗头兄弟社', type: 'jpeg', groupId: 'W04' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(W04)[狗狗队今天要打工]狗头兄弟社/养虎不为患(299118)+[小说]{38}[2021-05-13].jpeg', name: '养虎不为患', stallName: '狗头兄弟社', type: 'jpeg', groupId: 'W04' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(W04)[狗狗队今天要打工]狗头兄弟社/房塌(299104)+[小说]{18}[2021-05-08].jpeg', name: '房塌', stallName: '狗头兄弟社', type: 'jpeg', groupId: 'W04' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(W04)[狗狗队今天要打工]狗头兄弟社/梦游记(299089)+[小说]{9}[2021-05-05].jpeg', name: '梦游记', stallName: '狗头兄弟社', type: 'jpeg', groupId: 'W04' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(W04)[狗狗队今天要打工]狗头兄弟社/求生指南(299099)+[小说]{15}[2021-05-05].jpeg', name: '求生指南', stallName: '狗头兄弟社', type: 'jpeg', groupId: 'W04' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(W04)[狗狗队今天要打工]狗头兄弟社/深渊(299111)+[漫画]{23}[2021-05-05].jpeg', name: '深渊', stallName: '狗头兄弟社', type: 'jpeg', groupId: 'W04' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(W05)[雷狮安迷修种太阳]直男修改器/朝朝暮暮(249969)+[小说]{59}[2021-04-03].png', name: '朝朝暮暮', stallName: '直男修改器', type: 'png', groupId: 'W05' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(W05)[雷狮安迷修种太阳]直男修改器/雷安合志 日日夜夜(300142)+[小说]{33}[2021-05-18].png', name: '雷安合志 日日夜夜', stallName: '直男修改器', type: 'png', groupId: 'W05' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(W07)[猴面包树栽培场]山顶民政局/雷安新刊《Contract》(246759)+[漫画]{101}[2021-04-06].png', name: '雷安新刊《Contract》', stallName: '山顶民政局', type: 'png', groupId: 'W07' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(W09)[瑞金舔掉牙诊所]俏皮瑞金在线爱/【瑞金校园paro】少年(285883)+[图集]{6}[2021-03-13].png', name: '【瑞金校园paro】少年', stallName: '俏皮瑞金在线爱', type: 'png', groupId: 'W09' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(W10)[呜喵王的店]瑞金食堂/《终末之旅》瑞金同人小说本(293292)+[小说]{24}[2021-04-15].png', name: '《终末之旅》瑞金同人小说本', stallName: '瑞金食堂', type: 'png', groupId: 'W10' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(W10)[呜喵王的店]瑞金食堂/凹凸世界 瑞金向《瓶中魔 石中剑》(227413)+[漫画]{255}[2021-05-07].png', name: '凹凸世界 瑞金向《瓶中魔 石中剑》', stallName: '瑞金食堂', type: 'png', groupId: 'W10' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(W10)[呜喵王的店]瑞金食堂/凹凸世界 瑞金向打架本《剑术授课中》(203620)+[漫画]{280}[2021-05-07].png', name: '凹凸世界 瑞金向打架本《剑术授课中》', stallName: '瑞金食堂', type: 'png', groupId: 'W10' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(W10)[呜喵王的店]瑞金食堂/河神的选择题 瑞金漫画本(307582)+[漫画]{15}[2021-04-20].png', name: '河神的选择题 瑞金漫画本', stallName: '瑞金食堂', type: 'png', groupId: 'W10' }, { path: '/Users/mizuka/Downloads/pages/V57-W11 水华/(W11)[GK-Half  Sugar]瑞金调研协会/if the rain come(283263)+[小说]{17}[2021-04-16].png', name: 'if the rain come', stallName: '瑞金调研协会', type: 'png', groupId: 'W11' }]]]
    }
  },
  methods: {
    /**
     * 打开文件夹
     */
    async openDir () {
      const targetFolderPath = ipcRenderer.sendSync('openDir')
      if (targetFolderPath) {
        this.pageGroups = []
        try {
          this.active++
          const result = await getDayTaskMeta(targetFolderPath)
          this.pageGroups = result
          this.active++
        } catch (e) {
          this.active = 0
          this.pageGroups = []
          console.error(e)
          this.$message.error(e.message)
        }
      }
    },
    /**
     * 保存到文件夹
     */
    async saveDir () {
      const targetFolderPath = ipcRenderer.sendSync('saveDir')
      if (!targetFolderPath) {
        return 0
      }
      try {
        await outputDayTask(
          this.pageGroups,
          targetFolderPath,
          this.scriptOptions
        )
        this.$message.success('导出成功，请前往photoshop运行对应的jsx文件')
      } catch (e) {
        console.error(e)
        this.$messsage.error(e.message)
      }
    }
  }
}
</script>

<style lang="scss">
html,
body,
#app {
  margin: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
}

.main-container {
  display: flex !important;
  flex-direction: column;
}

.main {
  width: 100%;
  flex: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
}

.options {
  width: 100%;
  padding: 8px;
  border-left: 1px solid #eaeaea;
  height: 100%;
  width: 220px !important;
}
</style>
