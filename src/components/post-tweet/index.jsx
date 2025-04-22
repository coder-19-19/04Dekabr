import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Input,
    Nav,
    NavItem,
    NavLink,
    Spinner,
    TabContent,
    TabPane,
} from "reactstrap";
import {useRef, useState} from "react";
import {FaTrash} from "react-icons/fa";
import instance from "../../api/index.js";

const PostTweet = () => {
    const [activeTabId, setActiveTabId] = useState(1)
    const [files, setFiles] = useState([])
    const [isSaving, setIsSaving] = useState(false)
    const [progress, setProgress] = useState({})
    const [uploadedFiles, setUploadedFiles] = useState([])
    const textAreaRef = useRef()

    const handleChangeFiles = async e => {
        const localFiles = Array.from(e.target.files)
        const newData = [...files, ...localFiles]
        setFiles(newData)
        e.target.value = null

        const data = await Promise.all(localFiles.map((item, index) => {
            const formData = new FormData()
            formData.append('file', item)
            return instance.post('file/upload', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                onUploadProgress: e => {
                    setProgress({
                        ...progress,
                        [index]: e.loaded / e.total * 100
                    })
                }
            })
        }))
        setUploadedFiles([...uploadedFiles, ...data?.map(item => {
            const file = item.data.data.file
            return {
                ...file,
                file_uuid: file.id,
                file_path: file.path,
            }
        })])
    }

    const deleteFile = index => {
        setFiles(files.filter((file, i) => i !== index))
    }

    const postTweet = async e => {
        setIsSaving(true)
        e.preventDefault()
        const data = {
            description: textAreaRef.current.value,
            tweet_files: uploadedFiles
        }
        await instance.post('tweet/store', data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        textAreaRef.current.value = ''
        setFiles([])
        setProgress({})
        setUploadedFiles([])

        setIsSaving(false)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Post Tweet</CardTitle>
            </CardHeader>
            <CardBody>
                <form action="" onSubmit={postTweet}>
                    <Nav tabs>
                        <NavItem>
                            <NavLink className={activeTabId === 1 && 'active'} onClick={() => setActiveTabId(1)}>
                                Content
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={activeTabId === 2 && 'active'} onClick={() => setActiveTabId(2)}>
                                Files
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent className="mt-3" activeTab={activeTabId}>
                        <TabPane tabId={1}>
                            <div>
                                <Input innerRef={textAreaRef} type="textarea"/>
                            </div>
                        </TabPane>
                        <TabPane tabId={2}>
                            <label htmlFor="files" style={{
                                background: 'yellow',
                                borderRadius: 6,
                                padding: 10,
                                cursor: 'pointer'
                            }}>
                                Upload Files
                                <input accept=".png,.jpeg,.jpg,.mp4,.webp,.gif" id="files" onChange={handleChangeFiles}
                                       type="file" className="d-none" multiple/>
                            </label>
                            <div className="d-flex flex-wrap gap-1">
                                {files.map((item, index) => (
                                    <div key={index} className="d-flex flex-column gap-1">
                                        {item.type === 'video/mp4' ?
                                            <video width={200} height={200} src={URL.createObjectURL(item)} controls
                                                   autoPlay={false}/> :
                                            <img width={100} height={100} src={URL.createObjectURL(item)} alt=""/>}
                                        <Button onClick={() => deleteFile(index)} type="button" size="sm"
                                                color="danger"><FaTrash/></Button>
                                    </div>
                                ))}
                            </div>
                        </TabPane>
                    </TabContent>
                    <div className="d-flex justify-content-end mt-4">
                        <Button color="success" disabled={isSaving}>
                            {isSaving ? <Spinner size="sm"/> : 'Post'}
                        </Button>
                    </div>
                </form>
            </CardBody>
        </Card>
    )
}

export default PostTweet
