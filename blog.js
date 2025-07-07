// 全局变量
const ADMIN_PASSWORD = "Yxh20051027.";
let isAdmin = false;

// 初始化函数
function init() {
    setupLoginHandler();
    setupBlogFormHandler();
    setupCommentHandler();
    displayBlogs();
    updateVisitorCount();
}

// 设置登录行为
function setupLoginHandler() {
    document.getElementById('loginToggleBtn')?.addEventListener('click', function () {
        const modal = document.getElementById('loginModal');
        modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    });

    document.getElementById('loginForm')?.addEventListener('submit', function (event) {
        event.preventDefault();
        const password = document.getElementById('adminPassword').value;
        const status = document.getElementById('loginStatus');

        if (password === ADMIN_PASSWORD) {
            isAdmin = true;
            document.getElementById('loginModal').style.display = 'none';
            document.getElementById('loginToggleBtn').textContent = "已登录";
            document.getElementById('loginToggleBtn').disabled = true;
            status.textContent = '';
            alert("登录成功！");
        } else {
            status.textContent = '密码错误，请重试。';
        }
    });
}

// 设置博客提交行为
function setupBlogFormHandler() {
    document.getElementById('writeBlogForm')?.addEventListener('submit', function (event) {
        if (!isAdmin) {
            event.preventDefault();
            alert("请先登录以发布博客");
            return;
        }

        event.preventDefault();

        const blogTitle = document.getElementById('blogTitle').value;
        const blogContent = document.getElementById('blogContent').value;

        if (blogTitle && blogContent) {
            const blog = {
                title: blogTitle,
                content: blogContent,
                date: new Date().toLocaleDateString()
            };

            let blogs = JSON.parse(localStorage.getItem('blogs')) || [];
            blogs.push(blog);
            localStorage.setItem('blogs', JSON.stringify(blogs));

            document.getElementById('writeBlogForm').reset();
            displayBlogs();
            document.getElementById('blogResponse').textContent = '博客发布成功！';
        } else {
            document.getElementById('blogResponse').textContent = '请填写所有字段。';
        }
    });
}

// 设置评论相关事件
function setupCommentHandler() {
    // 动态为每个博客添加评论事件
    const blogContainer = document.getElementById('blog-container');
    blogContainer.addEventListener('submit', function (event) {
        if (event.target.classList.contains('comment-form')) {
            event.preventDefault();
            const blogIndex = event.target.dataset.blogIndex;
            const commentInput = event.target.querySelector('textarea');
            const commentText = commentInput.value.trim();

            if (commentText) {
                let blogs = JSON.parse(localStorage.getItem('blogs')) || [];
                if (blogs[blogIndex]) {
                    blogs[blogIndex].comments = blogs[blogIndex].comments || [];
                    blogs[blogIndex].comments.push(commentText);
                    localStorage.setItem('blogs', JSON.stringify(blogs));
                    displayBlogs();
                    commentInput.value = '';
                }
            }
        }
    });

    blogContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-comment')) {
            const blogIndex = event.target.dataset.blogIndex;
            const commentIndex = event.target.dataset.commentIndex;

            if (confirm("确定要删除此条评论吗？")) {
                let blogs = JSON.parse(localStorage.getItem('blogs')) || [];
                if (blogs[blogIndex] && blogs[blogIndex].comments && blogs[blogIndex].comments[commentIndex]) {
                    blogs[blogIndex].comments.splice(commentIndex, 1);
                    localStorage.setItem('blogs', JSON.stringify(blogs));
                    displayBlogs();
                }
            }
        }
    });
}

// 展示博客
function displayBlogs() {
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    const blogContainer = document.getElementById('blog-container');
    blogContainer.innerHTML = '';

    blogs.forEach((blog, index) => {
        const blogElement = document.createElement('div');
        blogElement.className = 'blog-post glass-effect';
        blogElement.innerHTML = `
            <h3>${blog.title}</h3>
            <p><strong>日期:</strong> ${blog.date}</p>
            <p>${blog.content}</p>
            <div class="comments-section">
                <h4>评论</h4>
                <ul id="comments-${index}" class="comment-list">
                    ${blog.comments ? blog.comments.map((comment, commentIndex) => `
                        <li>
                            ${comment}
                            <button class="delete-comment" data-blog-index="${index}" data-comment-index="${commentIndex}">删除</button>
                        </li>
                    `).join('') : ''}
                </ul>
                <form class="comment-form" data-blog-index="${index}">
                    <textarea placeholder="写下你的评论..." required></textarea>
                    <button type="submit">提交评论</button>
                </form>
            </div>
            <button onclick="editBlog(${index})" class="glass-effect">编辑</button>
            <button onclick="deleteBlog(${index})" class="glass-effect">删除</button>
        `;
        blogContainer.appendChild(blogElement);
    });
}

// 编辑博客
function editBlog(index) {
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    const blog = blogs[index];

    // 显示编辑模态框并填充内容
    document.getElementById('editBlogTitle').value = blog.title;
    document.getElementById('editBlogContent').value = blog.content;

    // 确认编辑
    document.getElementById('editBlogForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const newTitle = document.getElementById('editBlogTitle').value;
        const newContent = document.getElementById('editBlogContent').value;

        if (newTitle && newContent) {
            blog.title = newTitle;
            blog.content = newContent;
            localStorage.setItem('blogs', JSON.stringify(blogs));
            displayBlogs();
            alert("博客编辑成功！");
        } else {
            alert("请填写所有字段。");
        }
    });
}

// 删除博客
function deleteBlog(index) {
    if (!isAdmin) {
        alert("需要管理员权限才能删除博客");
        return;
    }

    if (confirm("确定要删除此篇博客吗？")) {
        let blogs = JSON.parse(localStorage.getItem('blogs')) || [];
        if (index >= 0 && index < blogs.length) {
            blogs.splice(index, 1);
            localStorage.setItem('blogs', JSON.stringify(blogs));
            displayBlogs();
        }
    }
}

// 更新访问人数
function updateVisitorCount() {
    let count = localStorage.getItem('visitorCount');

    if (!count) {
        // 第一次访问
        localStorage.setItem('visitorCount', '1');
        count = 1;
    } else {
        count = parseInt(count) + 1;
        localStorage.setItem('visitorCount', count.toString());
    }

    const visitorElement = document.getElementById('visitor-count');
    if (visitorElement) {
        visitorElement.textContent = `访问人数：${count} 人`;
    }
}

// 注销功能
function logout() {
    isAdmin = false;
    document.getElementById('loginToggleBtn').textContent = "登录";
    document.getElementById('loginToggleBtn').disabled = false;
    // 重置其他相关状态
}

// 切换暗黑模式
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// 强制清除博客数据
function forceClearBlogs() {
    if (!isAdmin) {
        alert("需要管理员权限才能执行此操作");
        return;
    }

    if (confirm("确定要强制清除所有博客数据吗？此操作将永久删除所有内容")) {
        localStorage.removeItem('blogs');
        displayBlogs();
        alert("所有博客数据已强制清除");
    }
}

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', init);
