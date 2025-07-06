// 全局变量
const ADMIN_PASSWORD = "Yxh20051027.";
let isAdmin = false;

// 初始化函数
function init() {
    setupLoginHandler();
    setupBlogFormHandler();
    displayBlogs();
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
            <button onclick="deleteBlog(${index})" class="glass-effect">删除</button>
        `;
        blogContainer.appendChild(blogElement);
    });
}

// 删除博客
function deleteBlog(index) {
    let blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    if (index >= 0 && index < blogs.length) {
        blogs.splice(index, 1);
        localStorage.setItem('blogs', JSON.stringify(blogs));
        displayBlogs();
    }
}

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', init);