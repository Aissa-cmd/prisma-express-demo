const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "ejs");

app.use('/', async (req, res, next) => {
	const user = await prisma.user.findUnique({
		where: {
			id: 1,
		}
	})

	req.user = user;
	next()
})

app.get("/", async (req, res) => {
	const posts = await prisma.post.findMany({
		include: {
			user: true
		}
	});
	res.render("index.ejs", { posts: posts, message: null });
});

app.post("/", async (req, res) => {
	try {
		const newPost = await prisma.user.update({
			where: {
				id: req.user.id
			},
			data: {
				posts: {
					create: {
						title: req.body.title,
						content: req.body.content
					}
				}
			}
		})

		const posts = await prisma.post.findMany();
		res.redirect("/?message=" + "new post was created successfully")
	} catch (err) {
		console.log(err)
		res.redirect("/?valid=" + "could not create new post")
	}
});

app.listen(3000, () => console.log("server listening on port 3000"));
