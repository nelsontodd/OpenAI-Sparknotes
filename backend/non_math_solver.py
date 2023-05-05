import os
import utils
import csv
import constants
import openai
from io import StringIO, BytesIO
from xhtml2pdf import pisa
from PyPDF2 import PdfReader, PdfWriter
from reportlab.platypus import SimpleDocTemplate, Paragraph, ListFlowable, ListItem
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
import markdown2
from xhtml2pdf import pisa
from io import StringIO, BytesIO


if __name__ == '__main__':
    hwdir, inputhw = "inputs/", "graceann"
    hwpdf = utils.read_pdf(hwdir+inputhw)
    output_filename=constants.output_path+"{}.pdf".format(inputhw)
    doc = utils.default_pdf_doc(constants.output_path+"temp_qualitative_hw.pdf")
    _items = [utils.pdf_title("Grace Ann Homework"), Spacer(1, 24)]
    hwresponse = ""
    for page in hwpdf:
        print("""Inputting {} tokens into
                {}.""".format(utils.num_tokens_from_messages(constants.NON_MATH_HW +
                    page),constants.model))
        hwresponse += utils.promptGPT(constants.NON_MATH_HW, page)
    utils.to_md(hwresponse, inputhw)
    utils.pandoc_pdf("outputs/{}".format(inputhw), "outputs/{}".format(inputhw))
    doc.build(_items)

    output_pdf = PdfWriter()
    reportlab_pdf = PdfReader(constants.output_path+"temp_qualitative_hw.pdf")
    pandoc_pdf = PdfReader(constants.output_path+"{}.pdf".format(inputhw))

    for page_num in range(len(reportlab_pdf.pages)):
        output_pdf.add_page(reportlab_pdf.pages[page_num])

    for page_num in range(len(pandoc_pdf.pages)):
        output_pdf.add_page(pandoc_pdf.pages[page_num])

    with open("outputs/{}.pdf".format(inputhw), "wb") as merged_file:
        output_pdf.write(merged_file)
    print('Solutions generated for file: {}'.format(inputhw))
