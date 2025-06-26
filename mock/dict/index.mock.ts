import { SUCCESS_CODE } from '@/constants'

const timeout = 1000

const dictObj: Recordable = {
  type: [
    {
      value: 0,
      label: 'tableDemo.WMP'
    },
    {
      value: 1,
      label: 'tableDemo.insurance'
    },
    {
      value: 2,
      label: 'tableDemo.fund'
    }
  ]
}

export default [
  // 字典接口
  {
    url: '/mock/dict/list',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: dictObj
      }
    }
  },
  // 获取某个字典
  {
    url: '/mock/dict/one',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          {
            label: 'test1',
            value: 0
          },
          {
            label: 'test2',
            value: 1
          },
          {
            label: 'test3',
            value: 2
          }
        ]
      }
    }
  }
]
