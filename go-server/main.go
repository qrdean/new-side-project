package main

import (
	"net/http"
	"log"
	"path/filepath"
	"fmt"
	"github.com/gin-gonic/gin"
)

type Book struct {
	Lccn        string `json:"lccn"`
	Isbn        string `json:"isbn"`
	Title       string `json:"title"`
	Author      string `json:"author"`
	PublishDate string `json:"publishDate"`
}

func main() {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.MaxMultipartMemory = 32 << 20
	r.POST("/upload", func(c *gin.Context) {
		file, err := c.FormFile("file")
		if err != nil {
			c.String(http.StatusBadRequest, "get form err: %s", err.Error())
			return
		}
		log.Println(file.Filename)
		filename := filepath.Base("book.csv")

		if err := c.SaveUploadedFile(file, filename); err != nil {
			c.String(http.StatusBadRequest, "upload file err: %s", err.Error())
			return
		}

		c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
	})
	r.Run(":8080")
}
