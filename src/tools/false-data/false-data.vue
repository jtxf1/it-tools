<template>
  <div class="fake-data-generator p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">虚假信息生成器</h1>

    <n-card title="生成配置" class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      <div class="flex justify-center mt-4">
        <n-button type="primary" @click="generateData" :loading="loading" class="mr-4">
          生成数据
        </n-button>
        <n-button @click="copyAllData" :disabled="!generatedData">
          复制全部
        </n-button>
      </div>
    </n-card>

    <n-card title="生成结果" v-if="generatedData">
      <div class="result-container">
        <div v-if="generatedData.idCards && generatedData.idCards.length > 0" class="mb-4">
          <h3 class="font-bold text-lg mb-2">身份证号码</h3>
          <div class="data-list">
            <n-tag v-for="(id, index) in generatedData.idCards" :key="'id-' + index" type="info" size="medium"
              class="m-1">
              {{ id }}
            </n-tag>
          </div>
        </div>

        <div v-if="generatedData.phones && generatedData.phones.length > 0" class="mb-4">
          <h3 class="font-bold text-lg mb-2">手机号码</h3>
          <div class="data-list">
            <n-tag v-for="(phone, index) in generatedData.phones" :key="'phone-' + index" type="success" size="medium"
              class="m-1">
              {{ phone }}
            </n-tag>
          </div>
        </div>

        <div v-if="generatedData.emails && generatedData.emails.length > 0" class="mb-4">
          <h3 class="font-bold text-lg mb-2">邮箱地址</h3>
          <div class="data-list">
            <n-tag v-for="(email, index) in generatedData.emails" :key="'email-' + index" type="warning" size="medium"
              class="m-1">
              {{ email }}
            </n-tag>
          </div>
        </div>

        <div v-if="generatedData.passwords && generatedData.passwords.length > 0" class="mb-4">
          <h3 class="font-bold text-lg mb-2">密码</h3>
          <div class="data-list">
            <n-tag v-for="(password, index) in generatedData.passwords" :key="'password-' + index" type="error"
              size="medium" class="m-1">
              {{ password }}
            </n-tag>
          </div>
        </div>

        <div v-if="generatedData.accounts && generatedData.accounts.length > 0" class="mb-4">
          <h3 class="font-bold text-lg mb-2">账号</h3>
          <div class="data-list">
            <n-tag v-for="(account, index) in generatedData.accounts" :key="'account-' + index" type="primary"
              size="medium" class="m-1">
              {{ account }}
            </n-tag>
          </div>
        </div>

        <div v-if="generatedData.addresses && generatedData.addresses.length > 0" class="mb-4">
          <h3 class="font-bold text-lg mb-2">住址</h3>
          <div class="data-list">
            <n-tag v-for="(address, index) in generatedData.addresses" :key="'address-' + index" type="primary"
              size="medium" class="m-1">
              {{ address }}
            </n-tag>
          </div>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { NCard, NFormItem, NInputNumber, NSwitch, NButton, NTag } from 'naive-ui'

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

const loading = ref(false)
const generatedData = ref<GeneratedData | null>(null)

const config = reactive<Config>({
  idCard: { count: 5, enabled: true },
  phone: { count: 5, enabled: true },
  email: { count: 5, enabled: true },
  password: { count: 5, enabled: true },
  account: { count: 5, enabled: true },
  address: { count: 5, enabled: true }
})

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
  const adjectives = ['happy', 'clever', 'bright', 'quick', 'calm', 'bold', 'wise', 'calm', 'cool', 'brave']
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

const generateData = () => {
  loading.value = true
  generatedData.value = {}

  // 延迟执行以模拟异步处理
  setTimeout(() => {
    if (config.idCard.enabled && config.idCard.count > 0) {
      generatedData.value!.idCards = Array.from({ length: config.idCard.count }, generateIdCard)
    }

    if (config.phone.enabled && config.phone.count > 0) {
      generatedData.value!.phones = Array.from({ length: config.phone.count }, generatePhone)
    }

    if (config.email.enabled && config.email.count > 0) {
      generatedData.value!.emails = Array.from({ length: config.email.count }, generateEmail)
    }

    if (config.password.enabled && config.password.count > 0) {
      generatedData.value!.passwords = Array.from({ length: config.password.count }, generatePassword)
    }

    if (config.account.enabled && config.account.count > 0) {
      generatedData.value!.accounts = Array.from({ length: config.account.count }, generateAccount)
    }

    if (config.address.enabled && config.address.count > 0) {
      generatedData.value!.addresses = Array.from({ length: config.address.count }, generateAddress)
    }

    loading.value = false
  }, 500)
}

const copyAllData = async () => {
  if (!generatedData.value) return

  let text = ''

  if (generatedData.value.idCards) {
    text += `身份证号码:\n${generatedData.value.idCards.join('\n')}\n\n`
  }

  if (generatedData.value.phones) {
    text += `手机号码:\n${generatedData.value.phones.join('\n')}\n\n`
  }

  if (generatedData.value.emails) {
    text += `邮箱地址:\n${generatedData.value.emails.join('\n')}\n\n`
  }

  if (generatedData.value.passwords) {
    text += `密码:\n${generatedData.value.passwords.join('\n')}\n\n`
  }

  if (generatedData.value.accounts) {
    text += `账号:\n${generatedData.value.accounts.join('\n')}\n\n`
  }

  if (generatedData.value.addresses) {
    text += `住址:\n${generatedData.value.addresses.join('\n')}\n\n`
  }

  try {
    await navigator.clipboard.writeText(text)
    // 这里可以添加提示信息，但由于不能使用浏览器API，我们只做复制操作
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<style>
.fake-data-generator {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.result-container {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;
}

.data-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 滚动条样式 */
.result-container::-webkit-scrollbar {
  width: 6px;
}

.result-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.result-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.result-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>