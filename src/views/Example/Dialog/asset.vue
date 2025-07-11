<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTag } from 'element-plus'
import { Table } from '@/components/Table'
import { getTableListApi, saveTableApi, delTableListApi } from '@/api/table'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import { ref, unref, reactive } from 'vue'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { BaseButton } from '@/components/Button'

const ids = ref<string[]>([])

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getTableListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    })
    return {
      list: res.data.list,
      total: res.data.total
    }
  },
  fetchDelApi: async () => {
    const res = await delTableListApi(unref(ids))
    return !!res
  }
})
const { loading, dataList, total, currentPage, pageSize } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const searchParams = ref({})
const setSearchParams = (params: any) => {
  searchParams.value = params
  getList()
}

const { t } = useI18n()

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'selection',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      type: 'selection'
    }
  },
  {
    field: 'index',
    label: t('tableDemo.index'),
    type: 'index',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    }
  },
  {
    field: 'name',
    label: t('tableDemo.name'),
    search: {
      component: 'Input'
    },
    form: {
      component: 'Input',
      componentProps: {
        disabled: true
      },
      colProps: {
        span: 24
      }
    },
    detail: {
      span: 24
    }
  },
  {
    field: 'productID',
    label: t('tableDemo.productID'),
    search: {
      hidden: false
    },
    form: {
      componentProps: {
        disabled: true
      }
    }
  },
  {
    field: 'acount',
    label: t('tableDemo.acount'),
    search: {
      hidden: true
    },
    form: {
      component: 'Input',
      componentProps: {
        disabled: true
      }
    }
  },
  {
    field: 'year',
    label: t('tableDemo.year'),
    search: {
      hidden: true
    },
    form: {
      component: 'Input',
      componentProps: {
        disabled: true
      }
    }
  },
  {
    field: 'rate',
    label: t('tableDemo.rate'),
    search: {
      hidden: true
    },
    form: {
      component: 'Input',
      componentProps: {
        disabled: true
      }
    }
  },
  {
    field: 'type',
    label: t('tableDemo.type'),
    search: {
      hidden: false
    },
    form: {
      component: 'Select',
      componentProps: {
        disabled: true,
        style: {
          width: '100%'
        },
        options: [
          {
            label: '理财',
            value: 3
          },
          {
            label: '保险',
            value: 2
          },
          {
            label: '基金',
            value: 1
          }
        ]
      }
    },
    table: {
      formatter: (row: TableData) => {
        const typeMap = { 3: '理财', 2: '保险', 1: '基金' }
        return typeMap[row.type] || '-'
      }
    }
  },
  {
    field: 'state',
    label: t('tableDemo.state'),
    search: {
      hidden: true
    },
    form: {
      component: 'Select',
      componentProps: {
        disabled: true,
        style: {
          width: '100%'
        },
        options: [
          {
            label: '已下线',
            value: 2
          },
          {
            label: '可购买',
            value: 1
          }
        ]
      }
    },
    table: {
      slots: {
        default: (data: any) => {
          const isActive = data.row.state === 1
          return (
            <ElTag type={isActive ? 'success' : 'danger'}>
              {isActive ? t('tableDemo.yes') : t('tableDemo.no')}
            </ElTag>
          )
        }
      }
    }
  },
  {
    field: 'asset',
    label: t('tableDemo.asset'),
    search: {
      component: 'Input',
      value: 100,
      componentProps: {
        disabled: true
      }
    },
    form: {
      component: 'InputNumber',
      value: 100,
      componentProps: {
        disabled: true
      }
    },
    table: {
      hidden: true
    }
  },
  {
    field: 'num',
    label: t('tableDemo.num'),
    search: {
      hidden: true
    },
    form: {
      component: 'InputNumber',
      value: 0
    },
    table: {
      hidden: true
    }
  },
  {
    field: 'action',
    width: '260px',
    label: t('tableDemo.action'),
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: any) => {
          return (
            <>
              <BaseButton type="primary" onClick={() => action(data.row, 'buy')}>
                {t('exampleDemo.buy')}
              </BaseButton>
              <BaseButton type="success" onClick={() => action(data.row, 'detail')}>
                {t('exampleDemo.detail')}
              </BaseButton>
              <BaseButton type="danger" onClick={() => delData(data.row)}>
                {t('exampleDemo.del')}
              </BaseButton>
            </>
          )
        }
      }
    }
  }
])

// @ts-ignore
const { allSchemas } = useCrudSchemas(crudSchemas)

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<TableData | null>(null)
const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.buy')
  currentRow.value = null
  dialogVisible.value = true
  actionType.value = ''
}

const delLoading = ref(false)

const delData = async (row: TableData | null) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row ? [row.id] : elTableExpose?.getSelectionRows().map((v: TableData) => v.id) || []
  delLoading.value = true
  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}

const action = (row: TableData, type: string) => {
  dialogTitle.value = t(type === 'buy' ? 'exampleDemo.buy' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    const res = await saveTableApi(formData)
      .catch(() => {})
      .finally(() => {
        saveLoading.value = false
      })
    if (res) {
      dialogVisible.value = false
      currentPage.value = 1
      getList()
    }
  }
}
</script>

<template>
  <ContentWrap>
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams" />

    <div class="mb-10px">
      <BaseButton type="primary" @click="AddAction">{{ t('exampleDemo.buy') }}</BaseButton>
      <BaseButton :loading="delLoading" type="danger" @click="delData(null)">
        {{ t('exampleDemo.del') }}
      </BaseButton>
    </div>

    <Table
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      :columns="allSchemas.tableColumns"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total: total
      }"
      @register="tableRegister"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write
      v-if="actionType !== 'detail'"
      ref="writeRef"
      :form-schema="allSchemas.formSchema"
      :current-row="currentRow"
    />

    <Detail
      v-if="actionType === 'detail'"
      :detail-schema="allSchemas.detailSchema"
      :current-row="currentRow"
    />

    <template #footer>
      <BaseButton
        v-if="actionType !== 'detail'"
        type="primary"
        :loading="saveLoading"
        @click="save"
      >
        {{ t('exampleDemo.buy') }}
      </BaseButton>
      <BaseButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</BaseButton>
    </template>
  </Dialog>
</template>
