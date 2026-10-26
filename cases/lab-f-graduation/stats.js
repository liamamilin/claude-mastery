// 阅读统计：纯函数。
export function monthlyCount(books, year, month) {
  // month：1–12（面向用户的月份）
  return books.filter(book => {
    const date = new Date(book.finished);
    return date.getFullYear() === year && date.getMonth() === month;
  }).length;
}

export function totalPages(books) {
  return books.reduce((sum, book) => sum + Number(book.pages), 0);
}
