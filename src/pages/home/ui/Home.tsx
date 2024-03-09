import { Button } from '@/shared/ui/button'
import { EmptyElement } from '@/shared/ui/empty'
import { ErrorElement } from '@/shared/ui/error'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import { Stars } from '@/shared/ui/stars'

export default function Home() {
    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' },
    ]
    return (
        <div>
            <h1>Hello world</h1>
            <Button size="small">Применить</Button>
            <Button size="big">Применить</Button>
            <Stars size="big" edit={true} />
            <Select options={options} placeholder="Select" />
            <Input placeholder="Введите текст..." />
            <ErrorElement color="dark" message="123" />
            <EmptyElement color="dark" />
        </div>
    )
}
