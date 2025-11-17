<template>
  <div class="fake-data-generator p-4 max-w-6xl mx-auto">
    <!-- 顶部操作栏 -->
    <div class="flex flex-wrap gap-3 mb-6 items-center justify-center">
      <c-button @click="() => modal1?.open1()">
        设置
      </c-button>
      <n-button type="primary" @click="generateData" :loading="loading">
        生成数据
      </n-button>
      <n-button @click="copyAllData" :disabled="!hasGeneratedData" secondary>
        复制全部
      </n-button>
    </div>

    <!-- 配置弹窗 -->
    <c-modal ref="modal1">
      <n-card title="生成配置" class="w-full max-w-2xl">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <n-form-item label="身份证数量">
            <n-input-number v-model:value="config.idCard.count" :min="0" :max="100" />
          </n-form-item>
          <n-form-item label="手机号数量">
            <n-input-number v-model:value="config.phone.count" :min="0" :max="100" />
          </n-form-item>
          <n-form-item label="邮箱数量">
            <n-input-number v-model:value="config.email.count" :min="0" :max="100" />
          </n-form-item>
          <n-form-item label="密码数量">
            <n-input-number v-model:value="config.password.count" :min="0" :max="100" />
          </n-form-item>
          <n-form-item label="账号数量">
            <n-input-number v-model:value="config.account.count" :min="0" :max="100" />
          </n-form-item>
          <n-form-item label="住址数量">
            <n-input-number v-model:value="config.address.count" :min="0" :max="100" />
          </n-form-item>

          <n-form-item label="身份证">
            <n-switch v-model:value="config.idCard.enabled" />
          </n-form-item>
          <n-form-item label="手机号">
            <n-switch v-model:value="config.phone.enabled" />
          </n-form-item>
          <n-form-item label="邮箱">
            <n-switch v-model:value="config.email.enabled" />
          </n-form-item>
          <n-form-item label="密码">
            <n-switch v-model:value="config.password.enabled" />
          </n-form-item>
          <n-form-item label="账号">
            <n-switch v-model:value="config.account.enabled" />
          </n-form-item>
          <n-form-item label="住址">
            <n-switch v-model:value="config.address.enabled" />
          </n-form-item>
        </div>

        <div class="flex justify-end mt-6 gap-3">
          <n-button @click="onClear">取消</n-button>
          <n-button type="primary" @click="confirmConfig">确认并生成</n-button>
        </div>
      </n-card>
    </c-modal>

    <!-- 结果区域：双列卡片布局 -->
    <div v-if="hasGeneratedData" class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <n-card title="身份证号码" v-if="generatedData.idCards?.length" class="shadow-sm">
        <div class="data-list">
          <n-tag v-for="(id, index) in generatedData.idCards" :key="'id-' + index" type="info" size="medium"
            class="m-1">
            <c-text-copyable :value="id" :displayed-value="id" />
          </n-tag>
        </div>
        <template #action>
          <n-button text @click="copyList(generatedData.idCards!)">复制</n-button>
        </template>
      </n-card>

      <n-card title="手机号码" v-if="generatedData.phones?.length" class="shadow-sm">
        <div class="data-list">
          <n-tag v-for="(phone, index) in generatedData.phones" :key="'phone-' + index" type="success" size="medium"
            class="m-1">
            <c-text-copyable :value="phone" :displayed-value="phone" />
          </n-tag>
        </div>
        <template #action>
          <n-button text @click="copyList(generatedData.phones!)">复制</n-button>
        </template>
      </n-card>

      <n-card title="邮箱地址" v-if="generatedData.emails?.length" class="shadow-sm">
        <div class="data-list">
          <n-tag v-for="(email, index) in generatedData.emails" :key="'email-' + index" type="warning" size="medium"
            class="m-1">
            <c-text-copyable :value="email" :displayed-value="email" />
          </n-tag>
        </div>
        <template #action>
          <n-button text @click="copyList(generatedData.emails!)">复制</n-button>
        </template>
      </n-card>

      <n-card title="密码" v-if="generatedData.passwords?.length" class="shadow-sm">
        <div class="data-list">
          <n-tag v-for="(password, index) in generatedData.passwords" :key="'password-' + index" type="error"
            size="medium" class="m-1">
            <c-text-copyable :value="password" :displayed-value="password" />
          </n-tag>
        </div>
        <template #action>
          <n-button text @click="copyList(generatedData.passwords!)">复制</n-button>
        </template>
      </n-card>

      <n-card title="账号" v-if="generatedData.accounts?.length" class="shadow-sm">
        <div class="data-list">
          <n-tag v-for="(account, index) in generatedData.accounts" :key="'account-' + index" type="primary"
            size="medium" class="m-1">
            <c-text-copyable :value="account" :displayed-value="account" />
          </n-tag>
        </div>
        <template #action>
          <n-button text @click="copyList(generatedData.accounts!)">复制</n-button>
        </template>
      </n-card>

      <n-card title="住址" v-if="generatedData.addresses?.length" class="shadow-sm">
        <div class="data-list">
          <n-tag v-for="(address, index) in generatedData.addresses" :key="'address-' + index" type="primary"
            size="medium" class="m-1">
            <c-text-copyable :value="address" :displayed-value="address" />
          </n-tag>
        </div>
        <template #action>
          <n-button text @click="copyList(generatedData.addresses!)">复制</n-button>
        </template>
      </n-card>
    </div>

    <!-- 空状态提示 -->
    <div v-else-if="!loading" class="text-center py-10 text-gray-500">
      点击“生成数据”或“设置”后开始生成虚假信息
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { NCard, NFormItem, NInputNumber, NSwitch, NButton, NTag, useMessage } from 'naive-ui'

interface ConfigItem {
  count: number
  enabled: boolean
}

interface Config {
  idCard: ConfigItem
  phone: ConfigItem
  email: ConfigItem
  password: ConfigItem
  account: ConfigItem
  address: ConfigItem
}

interface GeneratedData {
  idCards?: string[]
  phones?: string[]
  emails?: string[]
  passwords?: string[]
  accounts?: string[]
  addresses?: string[]
}

const modal1 = ref()
const message = useMessage()
const loading = ref(false)
const generatedData = ref<GeneratedData>({})

const config = reactive<Config>({
  idCard: { count: 5, enabled: true },
  phone: { count: 5, enabled: true },
  email: { count: 5, enabled: true },
  password: { count: 5, enabled: true },
  account: { count: 5, enabled: true },
  address: { count: 5, enabled: true }
})

const hasGeneratedData = computed(() => {
  return Object.values(generatedData.value).some(arr => Array.isArray(arr) && arr.length > 0)
})

// --- 数据生成函数（保持不变）---
const generateIdCard = (): string => {
  const provinces = ['11', '12', '13', '14', '15', '21', '22', '23', '31', '32', '33', '34', '35', '36', '37', '41', '42', '43', '44', '45', '46', '50', '51', '52', '53', '54', '61', '62', '63', '64', '65', '71', '81', '82']
  const province = provinces[Math.floor(Math.random() * provinces.length)]
  const city = String(Math.floor(Math.random() * 10))
  const county = String(Math.floor(Math.random() * 10))
  const birthYear = String(1950 + Math.floor(Math.random() * 70))
  const birthMonth = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0')
  const birthDay = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0')
  const sequence = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
  const check = String(Math.floor(Math.random() * 10))
  return `${province}${city}${county}${birthYear}${birthMonth}${birthDay}${sequence}${check}`
}

const generatePhone = (): string => {
  const prefixes = ['13', '14', '15', '16', '17', '18', '19']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = String(Math.floor(Math.random() * 100000000)).padStart(8, '0')
  return `${prefix}${suffix}`
}

const generateEmail = (): string => {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', '163.com', '126.com', 'qq.com']
  const username = 'user' + Math.floor(Math.random() * 10000)
  const domain = domains[Math.floor(Math.random() * domains.length)]
  return `${username}@${domain}`
}

const generatePassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

const generateAccount = (): string => {
  const adjectives = ['happy', 'clever', 'bright', 'quick', 'calm', 'bold', 'wise', 'cool', 'brave']
  const nouns = ['tiger', 'eagle', 'wolf', 'lion', 'bear', 'fox', 'deer', 'cat', 'dog', 'owl']
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const number = Math.floor(Math.random() * 1000)
  return `${adjective}_${noun}_${number}`
}

const generateAddress = (): string => {
  const provinces = ['北京市', '上海市', '广东省', '江苏省', '浙江省', '山东省', '河南省', '河北省', '四川省', '湖北省']
  const cities = ['广州市', '深圳市', '佛山市', '东莞市', '中山市', '珠海市', '汕头市', '惠州市', '江门市', '肇庆市']
  const districts = ['天河区', '越秀区', '荔湾区', '海珠区', '白云区', '黄埔区', '番禺区', '花都区', '南沙区', '从化区']
  const streets = ['中山路', '解放路', '人民路', '建设路', '东风路', '环市路', '天河路', '北京路', '上海路', '广州路']
  const province = provinces[Math.floor(Math.random() * provinces.length)]
  const city = cities[Math.floor(Math.random() * cities.length)]
  const district = districts[Math.floor(Math.random() * districts.length)]
  const street = streets[Math.floor(Math.random() * streets.length)]
  const number = Math.floor(Math.random() * 1000) + 1
  return `${province}${city}${district}${street}${number}号`
}

// --- 主要逻辑 ---
const generateData = () => {
  loading.value = true
  generatedData.value = {}

  setTimeout(() => {
    if (config.idCard.enabled && config.idCard.count > 0) {
      generatedData.value.idCards = Array.from({ length: config.idCard.count }, generateIdCard)
    }
    if (config.phone.enabled && config.phone.count > 0) {
      generatedData.value.phones = Array.from({ length: config.phone.count }, generatePhone)
    }
    if (config.email.enabled && config.email.count > 0) {
      generatedData.value.emails = Array.from({ length: config.email.count }, generateEmail)
    }
    if (config.password.enabled && config.password.count > 0) {
      generatedData.value.passwords = Array.from({ length: config.password.count }, generatePassword)
    }
    if (config.account.enabled && config.account.count > 0) {
      generatedData.value.accounts = Array.from({ length: config.account.count }, generateAccount)
    }
    if (config.address.enabled && config.address.count > 0) {
      generatedData.value.addresses = Array.from({ length: config.address.count }, generateAddress)
    }

    loading.value = false
  }, 500)
  onClear()
}

const confirmConfig = () => {
  generateData()
  onClear()
}

const copyList = async (list: string[]) => {
  try {
    await navigator.clipboard.writeText(list.join('\n'))
    message.success('已复制到剪贴板')
  } catch (err) {
    message.error('复制失败')
    console.error(err)
  }
}

const copyAllData = async () => {
  if (!hasGeneratedData.value) return

  let text = ''
  const { idCards, phones, emails, passwords, accounts, addresses } = generatedData.value

  if (idCards?.length) text += `身份证号码:\n${idCards.join('\n')}\n\n`
  if (phones?.length) text += `手机号码:\n${phones.join('\n')}\n\n`
  if (emails?.length) text += `邮箱地址:\n${emails.join('\n')}\n\n`
  if (passwords?.length) text += `密码:\n${passwords.join('\n')}\n\n`
  if (accounts?.length) text += `账号:\n${accounts.join('\n')}\n\n`
  if (addresses?.length) text += `住址:\n${addresses.join('\n')}\n\n`

  try {
    await navigator.clipboard.writeText(text.trim())
    message.success('全部数据已复制')
  } catch (err) {
    message.error('复制失败')
    console.error(err)
  }
}

function onClear() {
  modal1.value.close()
}
onMounted(() => {
  // 可选：默认不自动生成，由用户触发
  generateData()
})
</script>

<style scoped>
.fake-data-generator {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.data-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}
</style>