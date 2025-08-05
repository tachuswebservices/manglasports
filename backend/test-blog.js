async function testBlogAPI() {
  try {
    // Test creating a blog post without author
    const response = await fetch('http://localhost:4000/api/blog/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Test Blog Post Without Author',
        excerpt: 'This is a test blog post without an author',
        content: 'This is the content of the test blog post without an author.',
        category: 'Guides',
        status: 'published'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Blog post created successfully:', data);
    } else {
      const error = await response.json();
      console.log('❌ Error creating blog post:', error);
    }

    // Test fetching blog posts
    const getResponse = await fetch('http://localhost:4000/api/blog/posts');
    if (getResponse.ok) {
      const data = await getResponse.json();
      console.log('✅ Blog posts fetched successfully:', data);
    } else {
      console.log('❌ Error fetching blog posts');
    }

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testBlogAPI(); 