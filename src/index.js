import {connect, close} from './connection.js'

const db = await connect()
const usersCollection = db.collection('users')
const studentsCollection = db.collection('students')

const run = async () => {
    try {
        // await getUsersExample()
        // await task1()
        // await task2()
        // await task3()
        // await task4()
        // await task5()
        // await task6()
        // await task7()
        // await task8()
        // await task9()
        // await task10()
        // await task11()
        //await task12()

        await close()
    } catch (err) {
        console.log('Error: ', err)
    }
}
run()

// #### Users
// - Get users example
async function getUsersExample() {
    try {
        const [allUsers, firstUser] = await Promise.all([
            usersCollection.find().toArray(),
            usersCollection.findOne(),
        ])

        console.log('allUsers', allUsers)
        console.log('firstUser', firstUser)
    } catch (err) {
        console.error('getUsersExample', err)
    }
}

// - Get all users, sort them by age (ascending), and return only 5 records with firstName, lastName, and age fields.
async function task1() {
    try {
        const projection = {_id: 0, firstName: 1, lastName: 1, age: 1}
        const users = await usersCollection.find().sort({age: 1}).limit(5).project(projection).toArray()
        console.log('Task1', users)
    } catch (err) {
        console.error('task1', err)
    }
}

// - Add new field 'skills: []" for all users where age >= 25 && age < 30 or tags includes 'Engineering'
async function task2() {
    try {
        const filter = {
            $or: [
                {age: {$gte: 25, $lt: 30}},
                {tags: 'Engineering'}
            ]
        }
        const updateDocument = {$set: {skills: []}}
        const result = await usersCollection.updateMany(filter, updateDocument)
        const users = await usersCollection.find({}).toArray()
        console.log(`${result.modifiedCount} users updated.\nUsers ${JSON.stringify(users, null, 2)}`)
    } catch (err) {
        console.error('task2', err)
    }
}

// - Update the first document and return the updated document in one operation (add 'js' and 'git' to the 'skills' array)
//   Filter: the document should contain the 'skills' field
async function task3() {
    try {
        const filter = {skills: {$exists: true}}
        const update = {$push: {skills: {$each: ['js', 'git']}}}
        const user = await usersCollection.findOneAndUpdate(filter, update, {returnDocument: 'after'})
        console.log('Updated document:', user)
    } catch (err) {
        console.error('task3', err)
    }
}

// - REPLACE the first document where the 'email' field starts with 'john' and the 'address state' is equal to 'CA'
//   Set firstName: "Jason", lastName: "Wood", tags: ['a', 'b', 'c'], department: 'Support'
async function task4() {
    try {
        const filter = {
            email: {$regex: /^john/i},
            'address.state': 'CA'
        }
        const replacement = {firstName: 'Jason', lastName: 'Wood', tags: ['a', 'b', 'c'], department: 'Support'}
        const user = await usersCollection.findOneAndReplace(filter, replacement, {returnDocument: 'after'})
        console.log('Replaced user', user)
    } catch (err) {
        console.log('task4', err)
    }
}

// - Pull tag 'c' from the first document where firstName: "Jason", lastName: "Wood"
async function task5() {
    try {
        const filter = {firstName: 'Jason', lastName: 'Wood'}
        const update = {$pull: {tags: 'c'}}
        const user = await usersCollection.findOneAndUpdate(filter, update, {returnDocument: 'after'})
        console.log('User without tag c', user)
    } catch (err) {
        console.log('task5', err)
    }
}

// - Push tag 'b' to the first document where firstName: "Jason", lastName: "Wood"
//   ONLY if the 'b' value does not exist in the 'tags'
async function task6() {
    try {
        const filter = {firstName: 'Jason', lastName: 'Wood'}
        const update = {$addToSet: {tags: 'b'}}
        const user = await usersCollection.findOneAndUpdate(filter, update, {returnDocument: 'after'})
        console.log('Add tag b if doesn\'t exist', user)
    } catch (err) {
        console.log('task6', err)
    }
}

// - Delete all users by department (Support)
async function task7() {
    try {
        const filter = {department: 'Support'}
        const res = await usersCollection.deleteMany(filter)
        console.log(`Deleted count: ${res.deletedCount}`)
    } catch (err) {
        console.log('task7', err)
    }
}

// #### Articles
// - Create new collection 'articles'. Using bulk write:
//   Create one article per each type (a, b, c)
//   Find articles with type a, and update tag list with next value ['tag1-a', 'tag2-a', 'tag3']
//   Add tags ['tag2', 'tag3', 'super'] to articles except articles with type 'a'
//   Pull ['tag2', 'tag1-a'] from all articles
async function task8() {
    try {
        const articlesCollection = db.collection('articles')
        const result = await articlesCollection.bulkWrite([
            {
                insertOne: {
                    document: {
                        name: 'article 1',
                        type: 'a',
                        tags: []
                    }
                }
            },
            {
                insertOne: {
                    document: {
                        name: 'article 2',
                        type: 'b',
                        tags: []
                    }
                }
            },
            {
                insertOne: {
                    document: {
                        name: 'article 3',
                        type: 'c',
                        tags: []
                    }
                }
            },
            {
                updateMany: {
                    filter: {type: 'a'},
                    update: {$set: {tags: ['tag1-a', 'tag2-a', 'tag3']}}
                }
            },
            {
                updateMany: {
                    filter: {type: {$ne: 'a'}},
                    update: {$push: {tags: {$each: ['tag2', 'tag3', 'super']}}}
                }
            },
            {
                updateMany: {
                    filter: {},
                    update: {$pull: {tags: {$in: ['tag2', 'tag1-a']}}}

                }
            }
        ])
        console.log('Result', result)
        const articles = await articlesCollection.find().toArray()
        console.log('Articles', articles)
    } catch (err) {
        console.error('task8', err)
    }
}

// - Find all articles that contains tags 'super' or 'tag2-a'
async function task9() {
    try {
        const articlesCollection = db.collection('articles')
        const filter = {tags: {$in: ['super', 'tag2-a']}}
        const articles = await articlesCollection.find(filter).toArray()
        console.log('Articles', articles)
    } catch (err) {
        console.log('task9', err)
    }
}

// #### Students Statistic (Aggregations)
// - Find the student who have the worst score for homework, the result should be [ { name: <name>, worst_homework_score: <score> } ]
async function task10() {
    try {
        const pipeline = [
            {
                $unwind: '$scores'
            },
            {
                $match: {
                    'scores.type': 'homework'
                }
            },
            {
                $sort: {
                    'scores.score': 1
                }
            },
            {
                $limit: 1
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    worst_homework_score: '$scores.score'
                }
            }
        ]
        const student = await studentsCollection.aggregate(pipeline).toArray()
        console.log('student who have the worst score for homework', student)
    } catch (err) {
        console.log('task10', err)
    }
}

// - Calculate the average score for homework for all students, the result should be [ { avg_score: <number> } ]
async function task11() {
    try {
        const pipeline = [
            {
                $unwind: '$scores'
            },
            {
                $match: {
                    'scores.type': 'homework'
                }
            },
            {
                $group: {
                    _id: null,
                    avg_score: {$avg: '$scores.score'}
                }
            },
            {
                $project: {
                    _id: 0
                }
            }
        ]
        const res = await studentsCollection.aggregate(pipeline).toArray()
        console.log('Average score', res)
    } catch (err) {
        console.log('task11', err)
    }
}

// - Calculate the average score by all types (homework, exam, quiz) for each student, sort from the largest to the smallest value
async function task12() {
    try {
        const pipeline = [
            {
                $unwind: '$scores'
            },
            {
                $group: {
                    _id: '$name',
                    avg_score: {
                        $avg: '$scores.score'
                    }
                }
            },
            {
                $sort: {
                    avg_score: -1
                }
            },
            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    avg_score: 1
                }
            }
        ]
        const students = await studentsCollection.aggregate(pipeline).toArray()
        console.log('Students', students)
    } catch (err) {
        console.log('task12', err)
    }
}
