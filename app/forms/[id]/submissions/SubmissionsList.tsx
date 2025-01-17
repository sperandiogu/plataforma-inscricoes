'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Submission {
  id: string
  data: string
  createdAt: string | Date
}

interface Form {
  id: string
  title: string
  fields: string
}

export default function SubmissionsList({
  form,
  submissions
}: {
  form: Form
  submissions: Submission[]
}) {
  const fields = JSON.parse(form.fields as string)
  const parsedSubmissions = submissions.map(sub => ({
    ...sub,
    data: JSON.parse(sub.data as string)
  }))

  if (submissions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nenhuma resposta ainda</CardTitle>
          <CardDescription>
            Compartilhe o link do formulário para começar a receber respostas.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Respostas ({submissions.length})</CardTitle>
        <CardDescription>
          Todas as respostas submetidas para este formulário
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              {fields.map((field: any) => (
                <TableHead key={field.id}>{field.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {parsedSubmissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>
                  {new Date(submission.createdAt).toLocaleString()}
                </TableCell>
                {fields.map((field: any) => (
                  <TableCell key={field.id}>
                    {submission.data[field.name]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
