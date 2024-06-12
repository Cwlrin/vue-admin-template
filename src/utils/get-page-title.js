// 导入默认设置，这些设置可能包括应用的标题等配置信息
import defaultSettings from '@/settings'

// 使用默认设置中的标题，如果未设置，则使用'Vue Admin Template'作为默认标题
const title = defaultSettings.title || 'Vue Admin Template'

/**
 * 根据当前页面标题和应用标题生成最终的页面标题。
 * @param {string} pageTitle - 当前页面的标题。
 * @returns {string} 返回最终的页面标题，格式为"页面标题 - 应用标题"。
 */
export default function getPageTitle(pageTitle) {
  // 如果当前页面标题存在，则生成并返回带应用标题的完整页面标题
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  // 如果当前页面标题不存在，只返回应用标题
  return `${title}`
}

